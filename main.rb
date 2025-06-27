require 'yaml'
require 'date'
require 'erb'
require './Article'
require './Frontmatter'
require './TemplateRenderer.rb'


def match_frontmatter(s)
  /\-\-\-(.*?)\-\-\-/m.match(s)
end

def parse_frontmatter_match(match)
  if match then YAML.load(match[0]) else nil end
end

def strip_frontmatter(s)
  match = match_frontmatter(s)
  if match then s.gsub(match[0], '') else s end
end

def get_article_from_file(file_path)
  file_content = File.read(file_path)
  frontmatter_match = match_frontmatter(file_content)
  frontmatter = Frontmatter.new parse_frontmatter_match(frontmatter_match)
  Article.new file_path, frontmatter, strip_frontmatter(file_content)
end

markdown_files = Dir.glob './posts/**/*.md'
articles = markdown_files.map { |f| get_article_from_file f }
articles_by_date_desc = articles.sort { |a, b| b.date <=> a.date }

puts TemplateRenderer.render("views/article", :article => articles.first)
