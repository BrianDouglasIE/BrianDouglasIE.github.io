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

namespace tmpl = kainjow::mustache;

using namespace std;
namespace fs = filesystem;

#if defined(_WIN32) || defined(_WIN64)
constexpr const char *newline = "\r\n";
#else
constexpr const char *newline = "\n";
#endif

time_t parse_date_string(string input, string fmt) {
  tm tm = {};
  istringstream ss(input);
  ss >> get_time(&tm, "%d/%m/%Y");
  if (ss.fail()) {
    cout << "Failed to parse date string: " << input << endl;
  }
  return mktime(&tm);
}

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

string read_file(string file_path) {
  ifstream file(file_path);
  if (!file) {
    cerr << "Could not read: " << file_path << endl;
  }

  string result;
  string line;
  while (getline(file, line))
    result += line;
  return result;
}

void write_file(const std::string &file_path, const std::string &content) {
    std::ofstream file(file_path, std::ios::out | std::ios::trunc);

    if (!file.is_open()) {
        throw std::runtime_error("Failed to open file for writing: " + file_path);
    }

    file << content;

    if (!file) {
        throw std::runtime_error("Failed to write content to file: " + file_path);
    }
}

string trim(string input) {
  input.erase(0, input.find_first_not_of(" \t"));
  input.erase(input.find_last_not_of(" \t") + 1);
  return input;
}

class BlogPost {
public:
  BlogPost(string src_file) : _src_file{src_file} {
    if (!fs::exists(_src_file)) {
      throw runtime_error("Source file does not exist: " + _src_file);
    }

    ifstream file(_src_file);
    if (!file) {
      cerr << "Could not read: " << _src_file << endl;
      return;
    }

    string line;
    vector<string> tokens;
    while (getline(file, line)) {
      if (line == "---" || tokens.size() >= 3) {
        break;
      }

      tokens.push_back(trim(line));
    }

    _title = tokens[0];
    _date_string = tokens[1];
    _date = parse_date_string(tokens[1], "%d/%m/%Y");
    _tags = split(remove_chars_from_string(tokens[2], "[]"), ",");

    while (getline(file, line)) {
      _markdown += line + newline;
    }
  }

  const string title() const { return _title; }
  const string markdown() const { return _markdown; }
  const string date_string() const { return _date_string; }
  time_t date() const { return _date; }
  const vector<string> tags() const { return _tags; }

  string slug() {
    fs::path fs_path(_src_file);
    return fs_path.stem().string();
  }

private:
  string _src_file;
  string _title;
  time_t _date;
  string _date_string;
  string _markdown;
  vector<string> _tags;
};

int main() {
  const string posts_dir = "./posts";
  tmpl::mustache index_tmpl(read_file("./views/index.html"));
  tmpl::mustache post_tmpl(read_file("./views/post.html"));

  const string partials_dir = "./views/partials/";
  string site_header = read_file(partials_dir + "site-header.html");
  string site_footer = read_file(partials_dir + "site-footer.html");
  string post_excerpt_list = read_file(partials_dir + "post-excerpt-list.html");
  string post_title_list = read_file(partials_dir + "post-title-list.html");

  tmpl::partial site_header_partial{[&]() { return site_header; }};
  tmpl::partial site_footer_partial{[&]() { return site_footer; }};
  tmpl::partial post_excerpt_list_partial{[&]() { return post_excerpt_list; }};
  tmpl::partial post_title_list_partial{[&]() { return post_title_list; }};

  vector<BlogPost> posts;
  for (const auto &entry : fs::directory_iterator(posts_dir)) {
    BlogPost post(entry.path());
    posts.push_back(post);

    char *html = cmark_markdown_to_html(post.markdown().c_str(), post.markdown().size(), CMARK_OPT_UNSAFE);

    tmpl::data d;
    d["site-header"] = tmpl::data{site_header_partial};
    d["site-footer"] = tmpl::data{site_footer_partial};
    d["post-excerpt-list"] = tmpl::data{post_excerpt_list_partial};
    d["post-title-list"] = tmpl::data{post_title_list_partial};
    d["date"] = post.date_string();
    d["title"] = post.title();

    tmpl::data tags = tmpl::data::type::list;
    for(auto tag : post.tags()) tags.push_back(tag);
    d.set("tags", tags);
    d["content"] = string(html);

    write_file("./docs/" + post.slug() + "/index.html", post_tmpl.render(d));
  }

  return 0;
}
