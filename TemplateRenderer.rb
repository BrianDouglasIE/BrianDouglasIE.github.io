require 'erb'
require 'redcarpet'

module TemplateRenderer
  $markdown_renderer = Redcarpet::Markdown.new(Redcarpet::Render::HTML)
  $template_cache = {}

  def self.render(path, locals = {})
    context = Module.new do
      extend self
      include TemplateRenderer

      def self.get_binding
        binding
      end

      locals.each do |key, value|
        define_method(key) { value }
      end
    end

    template = $template_cache[path] ||= ERB.new(File.read("./templates/#{path}.erb"))
    template.result(context.get_binding)
  end

  def markdown_to_html(markdown)
    $markdown_renderer.render(markdown)
  end

  def render(path, locals = {})
    TemplateRenderer.render(path, locals)
  end
end

