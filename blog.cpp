#include <algorithm>
#include <ctime>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

using namespace std;
namespace fs = filesystem;

struct BlogPost {
  string src_file_path;
  string raw_content;
  string title;
  string date;
  vector<string> tags;
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

time_t parse_date_string(string input, string fmt) {
  tm tm = {};
  istringstream ss(input);
  ss >> get_time(&tm, "%d/%m/%Y");
  if (ss.fail()) {
    cout << "Failed to parse date string: " << input << endl;
  }
  return mktime(&tm);
}

int main() {
  const string posts_dir = "./posts";

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
          string chars = "[]";
          for (int i = 0; i < chars.length(); i++) {
            value.erase(remove(value.begin(), value.end(), chars[i]),
                        value.end());
          }
          post.tags = split(value, ",");
        }
      } else if(line != "---") {
        post.raw_content += line;
      }

      i++;
    }
    posts.push_back(post);
  }

  return 0;
}
