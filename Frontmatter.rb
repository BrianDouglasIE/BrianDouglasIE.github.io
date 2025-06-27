class Frontmatter
  attr_reader :title, :date, :tags

  def initialize(source)
    @title = source['title'] || ''
    @date = parse_date(source['date'])
    @tags = source['tags'] || []
  end

  private

  def parse_date(s)
    return nil if s.nil? || s.strip.empty?
    Date.parse(s)
  rescue ArgumentError
    nil
  end
end

