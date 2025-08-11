// client/src/utils/exporter.js

function getSvgData(svgElement) {
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svgElement);

  // Add namespaces
  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  // Add XML declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source);
}

export function exportToSvg(svgRef, fileName) {
  if (!svgRef.current) return;
  const svgUrl = getSvgData(svgRef.current);
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = `${fileName}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export function exportToPng(svgRef, fileName) {
  if (!svgRef.current) return;

  const svgElement = svgRef.current;
  const { width, height } = svgElement.getBBox();

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const svgData = getSvgData(svgElement);

  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0);
    const pngUrl = canvas.toDataURL('image/png');
    
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${fileName}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  img.src = svgData;
}
