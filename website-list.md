---
layout: page # Use the 'page' layout from Minima
title: "Useful Websites"
permalink: /website-list/ # Make the URL clean
---

## My Curated List of Useful Websites

Here are some sites I find handy, collected over time.

<hr>

{% assign sorted_websites = site.collections.websites | sort: "title" %}

{% for site_item in sorted_websites %}
<div class="website-entry" style="margin-bottom: 1.5em;">
  <h3>
    <a href="{{ site_item.site_url }}" target="_blank" rel="noopener noreferrer">{{ site_item.title }}</a>
  </h3>
  <p>{{ site_item.description }}</p>
  {% if site_item.tags and site_item.tags.size > 0 %}
    <p>
      <strong>Tags:</strong>
      {% for tag in site_item.tags %}
        <span class="tag" style="background-color: #eee; padding: 2px 6px; border-radius: 3px; margin-right: 4px; font-size: 0.9em;">{{ tag }}</span>
      {% endfor %}
    </p>
  {% endif %}
  {% if site_item.content != "" %}
    <details>
      <summary style="cursor: pointer; font-size: 0.9em;">More Notes</summary>
      <div style="border-left: 2px solid #ccc; padding-left: 10px; margin-top: 5px;">
        {{ site_item.content | markdownify }}
      </div>
    </details>
  {% endif %}
</div>
<hr>
{% else %}
  <p>No websites listed yet. Add some Markdown files to the <code>_websites</code> folder!</p>
{% endfor %}
