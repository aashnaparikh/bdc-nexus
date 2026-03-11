package com.bdcnexus.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class SwaggerCssFilter implements Filter {

    private static final String CSS = """
<style>
/* ── BDC-Nexus Custom Swagger UI Theme ── */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

body,
.swagger-ui,
.swagger-ui .wrapper,
.swagger-ui section,
.swagger-ui .model-box,
.swagger-ui .models-control,
.swagger-ui .scheme-container {
  background-color: #060B18 !important;
  color: #E2EAF4 !important;
  font-family: 'Outfit', sans-serif !important;
  background-image: 
    linear-gradient(rgba(0, 200, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 200, 255, 0.025) 1px, transparent 1px) !important;
  background-size: 48px 48px !important;
}

.swagger-ui,
.swagger-ui .info,
.swagger-ui .info p,
.swagger-ui .info li,
.swagger-ui .info table,
.swagger-ui p,
.swagger-ui table thead tr th, 
.swagger-ui table tbody tr td {
  color: #E2EAF4 !important;
  font-family: 'Outfit', sans-serif !important;
}

.swagger-ui .info a {
  color: #00C8FF !important;
}

.swagger-ui .topbar {
  background-color: #030812 !important;
  border-bottom: 1px solid rgba(0, 200, 255, 0.12) !important;
  backdrop-filter: blur(12px) !important;
}

.swagger-ui .topbar-wrapper .link img {
  filter: brightness(0) invert(1) sepia(100%) saturate(1000%) hue-rotate(180deg) !important;
}

.swagger-ui .opblock-tag {
  color: #00C8FF !important;
  border-bottom: 1px solid rgba(0, 200, 255, 0.35) !important;
  font-family: 'Syne', sans-serif !important;
  font-size: 24px !important;
  font-weight: 800 !important;
  text-transform: uppercase;
}

.swagger-ui .opblock-tag small {
  color: #4E6480 !important;
}

.swagger-ui .opblock {
  background: #0C1426 !important;
  border: 1px solid rgba(0, 200, 255, 0.12) !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
  margin-bottom: 16px !important;
  transition: all 0.2s !important;
}

.swagger-ui .opblock:hover {
  border-color: rgba(0, 200, 255, 0.35) !important;
  box-shadow: 0 0 24px rgba(0, 200, 255, 0.15) !important;
}

.swagger-ui .opblock .opblock-summary-path {
  color: #00C8FF !important;
  font-family: 'DM Mono', monospace !important;
}

.swagger-ui .opblock .opblock-summary-description {
  color: #4E6480 !important;
}

.swagger-ui .opblock.opblock-get { border-color: #6366F1 !important; background: rgba(99, 102, 241, 0.05) !important; }
.swagger-ui .opblock.opblock-get .opblock-summary-method { background: #6366F1 !important; }

.swagger-ui .opblock.opblock-post { border-color: #10B981 !important; background: rgba(16, 185, 129, 0.05) !important; }
.swagger-ui .opblock.opblock-post .opblock-summary-method { background: #10B981 !important; }

.swagger-ui .opblock.opblock-put { border-color: #F59E0B !important; background: rgba(245, 158, 11, 0.05) !important; }
.swagger-ui .opblock.opblock-put .opblock-summary-method { background: #F59E0B !important; }

.swagger-ui .opblock.opblock-delete { border-color: #EF4444 !important; background: rgba(239, 68, 68, 0.05) !important; }
.swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #EF4444 !important; }

.swagger-ui section.models {
  background: #0C1426 !important;
  border: 1px solid rgba(0, 200, 255, 0.12) !important;
  border-radius: 12px !important;
}

.swagger-ui section.models h4,
.swagger-ui section.models h5 {
  color: #00C8FF !important;
  font-family: 'Syne', sans-serif !important;
}

.swagger-ui .model-title {
  color: #E2EAF4 !important;
}

.swagger-ui .parameter__name, 
.swagger-ui .parameter__type {
  color: #00C8FF !important;
}

.swagger-ui .btn {
  background: transparent !important;
  border: 1px solid #00C8FF !important;
  color: #00C8FF !important;
  box-shadow: none !important;
  font-family: 'Syne', sans-serif !important;
  font-weight: 700 !important;
  border-radius: 6px !important;
  text-transform: uppercase !important;
}

.swagger-ui .btn.execute {
  background: linear-gradient(135deg, #00C8FF, #0099CC) !important;
  color: #060B18 !important;
  border: none !important;
}

.swagger-ui .btn:hover {
  background: rgba(0, 200, 255, 0.1) !important;
  box-shadow: 0 0 12px rgba(0, 200, 255, 0.4) !important;
}

.swagger-ui .btn.execute:hover {
  background: #00aadd !important;
  color: #060B18 !important;
}

.swagger-ui input,
.swagger-ui textarea,
.swagger-ui select {
  background: rgba(0, 200, 255, 0.04) !important;
  border: 1px solid rgba(0, 200, 255, 0.12) !important;
  color: #E2EAF4 !important;
  border-radius: 6px !important;
  font-family: 'DM Mono', monospace !important;
}

.swagger-ui .responses-inner h4, 
.swagger-ui .responses-inner h5 {
  color: #E2EAF4 !important;
}

.swagger-ui table.responses-table {
  border-bottom: 1px solid rgba(0, 200, 255, 0.12) !important;
}

.swagger-ui .response-col_status, 
.swagger-ui .response-col_links {
  color: #E2EAF4 !important;
}

.swagger-ui .opblock-body pre.microlight {
  background: #030812 !important;
  border-radius: 8px !important;
  border: 1px solid rgba(0,200,255,0.1) !important;
  color: #E2EAF4 !important;
}

.swagger-ui .scheme-container {
  background: #030812 !important;
  box-shadow: none !important;
  border-bottom: 1px solid rgba(0, 200, 255, 0.12) !important;
}

.swagger-ui svg {
  fill: #E2EAF4 !important;
}

.swagger-ui .info .title {
  color: #00C8FF !important;
  font-family: 'Syne', sans-serif !important;
  font-size: 42px !important;
  text-shadow: 0 0 20px rgba(0,200,255,0.3) !important;
}
</style>
""";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        if (req.getRequestURI().endsWith("/swagger-ui/index.html") || req.getRequestURI().endsWith("/swagger-ui.html")) {
            org.springframework.web.util.ContentCachingResponseWrapper wrapper = new org.springframework.web.util.ContentCachingResponseWrapper((HttpServletResponse) response);
            chain.doFilter(request, wrapper);

            String html = new String(wrapper.getContentAsByteArray(), StandardCharsets.UTF_8);
            if (html.contains("</body>")) {
                html = html.replace("</body>", CSS + "\n</body>");
            }
            
            byte[] bytes = html.getBytes(StandardCharsets.UTF_8);
            response.setContentLength(bytes.length);
            response.getOutputStream().write(bytes);
        } else {
            chain.doFilter(request, response);
        }
    }
}
