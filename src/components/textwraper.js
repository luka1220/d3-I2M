var d3 = require("d3");

export const wrap = (text, width) => {
  console.log(text, width)
  text.each(function() {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse().filter(word => word.length > 0),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dx = text.attr("dx"),
        tspan = text.text(null).append("tspan").attr("x", 0);
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", dx).attr("dy", lineHeight + "em").text(word);
      }
    }
  });
}