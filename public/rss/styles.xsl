<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
            line-height: 1.6;
          }
          .header {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header h1 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 2em;
          }
          .header p {
            margin: 5px 0;
            color: #666;
          }
          .header a {
            color: #007acc;
            text-decoration: none;
          }
          .header a:hover {
            text-decoration: underline;
          }
          .item {
            background: white;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: box-shadow 0.2s ease;
          }
          .item:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          }
          .item h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 1.3em;
          }
          .item a {
            color: #007acc;
            text-decoration: none;
          }
          .item a:hover {
            text-decoration: underline;
          }
          .meta {
            color: #666;
            font-size: 0.9em;
            margin-top: 10px;
            border-top: 1px solid #eee;
            padding-top: 10px;
          }
          .categories {
            margin-top: 10px;
          }
          .category {
            background: #e1f5fe;
            color: #0277bd;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-right: 5px;
            margin-bottom: 5px;
            display: inline-block;
          }
          .description {
            color: #555;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #666;
            font-size: 0.9em;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p><xsl:value-of select="/rss/channel/description"/></p>
          <p><a href="{/rss/channel/link}">Visitar el sitio web</a></p>
          <xsl:if test="/rss/channel/lastBuildDate">
            <p><strong>Última actualización:</strong> <xsl:value-of select="/rss/channel/lastBuildDate"/></p>
          </xsl:if>
        </div>

        <xsl:for-each select="/rss/channel/item">
          <div class="item">
            <h3><a href="{link}"><xsl:value-of select="title"/></a></h3>
            <div class="description"><xsl:value-of select="description"/></div>
            <div class="meta">
              <xsl:if test="pubDate">
                <strong>Publicado:</strong> <xsl:value-of select="pubDate"/><br/>
              </xsl:if>
              <xsl:if test="updatedDate">
                <strong>Actualizado:</strong> <xsl:value-of select="updatedDate"/><br/>
              </xsl:if>
            </div>
            <xsl:if test="category">
              <div class="categories">
                <strong>Etiquetas:</strong><br/>
                <xsl:for-each select="category">
                  <span class="category"><xsl:value-of select="."/></span>
                </xsl:for-each>
              </div>
            </xsl:if>
          </div>
        </xsl:for-each>

        <div class="footer">
          <p>Feed RSS generado con Astro - <xsl:value-of select="/rss/channel/title"/></p>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
