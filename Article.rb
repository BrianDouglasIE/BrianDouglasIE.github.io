require 'forwardable'

class Article extend Forwardable
  def_delegators :@frontmatter, :title, :date, :tags

  def initialize(src_file, frontmatter, content)
    @frontmatter = frontmatter
    @content = content
    @src_file = src_file
    @excerpt_delimeter = '<!-- more -->'
  end

  def excerpt
    return "" unless has_excerpt?
    @content.split(@excerpt_delimeter).first
  end

  def body
    return @content unless has_excerpt?
    @content.split(@excerpt_delimeter, 2).last
  end

  def uri
    '/' + File.basename(@src_file.sub(/\.md$/, ''))
  end

  def has_excerpt?
    @content.include?(@excerpt_delimeter)
  end
end
