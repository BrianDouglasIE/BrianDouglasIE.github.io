#include "mustache.hpp"
#include <algorithm>
#include <cmark.h>
#include <ctime>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <ostream>
#include <sstream>
#include <string>
#include <vector>

using namespace kainjow::mustache;

using namespace std;
namespace fs = filesystem;

#if defined(_WIN32) || defined(_WIN64)
constexpr const char *newline = "\r\n";
#else
constexpr const char *newline = "\n";
#endif

struct BlogPost {
  string src_file_path;
  string raw_content;
  string html;
  string title;
  string date;
  string tags;
  string slug;
};

vector<string> split(string input, string del) {
  vector<string> tokens;
  size_t pos = 0;
  string token;
  while ((pos = input.find(del)) != string::npos) {
    token = input.substr(0, pos);
    tokens.push_back(token);
    input.erase(0, pos + del.length());
  }
  tokens.push_back(input);
  return tokens;
}

string remove_chars_from_string(string s, string chars) {
  for (int i = 0; i < chars.length(); i++) {
    s.erase(remove(s.begin(), s.end(), chars[i]), s.end());
  }
  return s;
}

string remove_from_string(string s, const string &sub) {
  size_t pos = 0;
  while ((pos = s.find(sub, pos)) != string::npos) {
    s.erase(pos, sub.length());
  }
  return s;
}

time_t parse_date_string(string input, string fmt) {
  tm tm = {};
  istringstream ss(input);
  ss >> get_time(&tm, "%d/%m/%Y");
  if (ss.fail()) {
    cout << "Failed to parse date string: " << input << endl;
  }
  return mktime(&tm);
}

string read_file(string file_path) {
  ifstream file(file_path);
  string result;
  string line;
  while (getline(file, line))
    result += line;
  return result;
}

void write_file(string file_path, string content) {
  ofstream file;
  file.open(file_path);
  file << content;
  file.close();
}

int main() {
  const string posts_dir = "./posts";
  mustache index_tmpl(read_file("./views/index.html"));
  mustache post_tmpl(read_file("./views/post.html"));

  std::string site_header     = read_file("./views/partials/site-header.html");
  std::string site_footer     = read_file("./views/partials/site-footer.html");
  std::string post_excerpt_list = read_file("./views/partials/post-excerpt-list.html");
  std::string post_title_list   = read_file("./views/partials/post-title-list.html");

  // Wrap them into `partial` objects
  kainjow::mustache::partial site_header_partial{[&]() { return site_header; }};
  kainjow::mustache::partial site_footer_partial{[&]() { return site_footer; }};
  kainjow::mustache::partial post_excerpt_list_partial{[&]() { return post_excerpt_list; }};
  kainjow::mustache::partial post_title_list_partial{[&]() { return post_title_list; }};


  vector<BlogPost> posts;
  for (const auto &entry : fs::directory_iterator(posts_dir)) {
    BlogPost post;
    post.src_file_path = entry.path();
    ifstream file(post.src_file_path);
    string line;
    int i = 0;
    bool in_frontmatter = false;
    while (getline(file, line)) {
      if (line == "---" && i == 0) {
        in_frontmatter = true;
      } else if (line == "---" && i != 0) {
        in_frontmatter = false;
      }

      if (in_frontmatter) {
        vector<string> tokens = split(line, ":");
        string field = tokens[0];
        string value = tokens[tokens.size() - 1];

        if (field == "title") {
          post.title = value;
        }

        if (field == "date") {
          post.date = value;
        }

        if (field == "tags") {
          post.tags = remove_chars_from_string(value, "[]");
        }
      } else if (line != "---") {
        post.raw_content += (line + newline);
      }

      i++;
    }
    char *html = cmark_markdown_to_html(post.raw_content.c_str(),
                                        post.raw_content.size(), 0);

    kainjow::mustache::data data;
    data["site-header"]       = kainjow::mustache::data{site_header_partial};
    data["site-footer"]       = kainjow::mustache::data{site_footer_partial};
    data["post-excerpt-list"] = kainjow::mustache::data{post_excerpt_list_partial};
    data["post-title-list"]   = kainjow::mustache::data{post_title_list_partial};
    data["date"] = post.date;
    data["title"] = post.title;
    data["tags"] = post.tags;
    data["content"] = string(html);

    post.html = post_tmpl.render(data);

    auto slug = remove_from_string(post.src_file_path, "./posts");
    post.slug = remove_from_string(slug, ".md");

    write_file("./docs" + post.slug + "/index.html", post.html);

    posts.push_back(post);
  }

  return 0;
}
