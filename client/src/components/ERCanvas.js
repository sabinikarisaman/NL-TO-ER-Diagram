import React, { useMemo } from 'react';

// --- Layout Configuration ---
const PADDING = 80;
const ENTITY = { width: 140, height: 50, hSpacing: 180, vSpacing: 250 };
const ATTRIBUTE = { rx: 75, ry: 25, vSpacing: 50 };
const RELATIONSHIP = { width: 130, height: 50 };
const FONT_FAMILY = "Segoe UI, Arial";

export default function ERCanvas({ er, svgRef }) {
  const layout = useMemo(() => {
    if (!er || !er.entities || er.entities.length === 0) return null;

    const nodes = {};
    const links = [];
    const entitiesPerRow = Math.min(er.entities.length, 4);

    // 1. Initial Grid Placement for Entities
    er.entities.forEach((entity, i) => {
      nodes[entity.name] = {
        ...entity, id: entity.name, type: 'entity',
        x: PADDING + (i % entitiesPerRow) * (ENTITY.width + ENTITY.hSpacing),
        y: PADDING + Math.floor(i / entitiesPerRow) * ENTITY.vSpacing,
      };
    });
    
    // 2. Place Attributes
    Object.values(nodes).filter(n => n.type === 'entity').forEach(entityNode => {
        const entityAttrs = (er.attributes || []).filter(a => a.entity === entityNode.name);
        const columns = Math.ceil(entityAttrs.length / 3);
        const columnWidth = (ATTRIBUTE.rx * 2) + 10;

        entityAttrs.forEach((attr, i) => {
            const id = `${entityNode.id}-${attr.attribute}`;
            const isPK = attr.attribute.startsWith('PK_');
            const isMV = attr.attribute.startsWith('MV_');
            const isDerived = attr.attribute.startsWith('DA_');
            const cleanAttribute = attr.attribute.replace(/^(PK_|MV_|DA_)/, '');
            
            const col = Math.floor(i / 3);
            const row = i % 3;
            
            nodes[id] = {
                ...attr, id, type: 'attribute', attribute: cleanAttribute, isPK, isMV, isDerived,
                x: entityNode.x - (columns - 1) * columnWidth / 2 + col * columnWidth,
                y: entityNode.y - (ENTITY.height / 2) - (ATTRIBUTE.ry + ATTRIBUTE.vSpacing) - (row * (ATTRIBUTE.ry * 2 + 10)),
            };
            links.push({ source: id, target: entityNode.id });

            if (attr.components) {
                nodes[id].isComposite = true;
                attr.components.forEach((comp, j) => {
                    const compId = `${id}-${comp}`;
                    nodes[compId] = {
                        id: compId, type: 'attribute', attribute: comp,
                        x: nodes[id].x + (j - (attr.components.length-1)/2) * (ATTRIBUTE.rx * 1.2),
                        y: nodes[id].y - ATTRIBUTE.ry - 30
                    };
                    links.push({source: compId, target: id})
                })
            }
        });
    });

    // 3. Place Relationships and their Attributes
    (er.relationships || []).forEach((rel, i) => {
      const fromEntity = nodes[rel.from];
      const toEntity = nodes[rel.to];
      if (!fromEntity || !toEntity) return;

      const id = `${rel.label}-${i}`;
      nodes[id] = { 
        ...rel, id, type: 'relationship', 
        x: (fromEntity.x + toEntity.x) / 2, 
        y: Math.max(fromEntity.y, toEntity.y) + ENTITY.vSpacing / 2.2,
      };
      links.push({ source: id, target: rel.from });
      links.push({ source: id, target: rel.to });

      (rel.attributes || []).forEach((attr, j) => {
        const attrId = `${id}-${attr}`;
        nodes[attrId] = { id: attrId, label: attr, type: 'rel-attribute', x: nodes[id].x, y: nodes[id].y + RELATIONSHIP.height / 2 + ATTRIBUTE.ry + 20 + (j * 60) };
        links.push({ source: attrId, target: id, isDashed: true });
      });
    });

    // 4. Calculate final viewBox
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    Object.values(nodes).forEach(node => {
      const width = node.type === 'entity' ? ENTITY.width : node.type === 'relationship' ? RELATIONSHIP.width : ATTRIBUTE.rx * 2;
      const height = node.type === 'entity' ? ENTITY.height : node.type === 'relationship' ? RELATIONSHIP.height : ATTRIBUTE.ry * 2;
      minX = Math.min(minX, node.x - width / 2);
      minY = Math.min(minY, node.y - height / 2);
      maxX = Math.max(maxX, node.x + width / 2);
      maxY = Math.max(maxY, node.y + height / 2);
    });

    const viewBox = `${minX - PADDING} ${minY - PADDING} ${maxX - minX + PADDING * 2} ${maxY - minY + PADDING * 2}`;
    
    return { nodes: Object.values(nodes), links, viewBox, cardinalities: er.cardinalities || [] };
  }, [er]);

  if (!layout) return null;
  const { nodes, links, viewBox, cardinalities } = layout;
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <svg ref={svgRef} width="100%" viewBox={viewBox} style={{ border: '1px solid #aaa', background: '#fff', fontFamily: FONT_FAMILY }}>
      {/* SECTION 1: LINES */}
      {links.map((link, i) => {
        const source = nodeMap.get(link.source);
        const target = nodeMap.get(link.target);
        if (!source || !target) return null;
        return <line key={`link-${i}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke="#333" strokeDasharray={link.isDashed ? '4,4' : 'none'} />;
      })}

      {/* SECTION 2: SHAPES & TEXT */}
      {nodes.map((node, i) => {
        const key = `node-${i}-${node.id}`;
        switch (node.type) {
          case 'entity':
            return (
              <g key={key}>
                <rect x={node.x - ENTITY.width/2} y={node.y - ENTITY.height/2} width={ENTITY.width} height={ENTITY.height} stroke="#222" fill="#f8f8ff" strokeWidth={node.isWeak ? 2 : 1} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontWeight="bold" fontSize="16">{node.name}</text>
              </g>
            );
          case 'attribute':
          case 'rel-attribute':
            return (
              <g key={key}>
                <ellipse cx={node.x} cy={node.y} rx={ATTRIBUTE.rx} ry={ATTRIBUTE.ry} fill="#fffbe7" stroke="#333" strokeDasharray={node.isDerived ? '4,4' : 'none'} />
                {node.isMV && <ellipse cx={node.x} cy={node.y} rx={ATTRIBUTE.rx-5} ry={ATTRIBUTE.ry-5} fill="none" stroke="#333" />}
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" style={{textDecoration: node.isPK ? 'underline' : 'none'}}>{node.attribute || node.label}</text>
              </g>
            );
          case 'relationship':
            return (
              <g key={key}>
                <polygon points={`${node.x},${node.y - RELATIONSHIP.height/2} ${node.x + RELATIONSHIP.width/2},${node.y} ${node.x},${node.y + RELATIONSHIP.height/2} ${node.x - RELATIONSHIP.width/2},${node.y}`} fill="#e6f2ff" stroke="#222" strokeWidth={node.isIdentifying ? 2 : 1} />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="14" fontWeight="500">{node.label}</text>
              </g>
            );
          default: return null;
        }
      })}

      {/* SECTION 3: CARDINALITIES */}
      {(cardinalities).map((card, i) => {
          const fromNode = nodeMap.get(card.from);
          const toNode = nodeMap.get(card.to);
          const relNode = nodes.find(n => n.type === 'relationship' && ((n.from === card.from && n.to === card.to) || (n.from === card.to && n.to === card.from)));
          if (!fromNode || !toNode || !relNode) return null;
          
          const [fromCard, toCard] = card.type.split(':');
          
          const card1X = (fromNode.x + relNode.x) / 2;
          const card1Y = (fromNode.y + relNode.y) / 2;
          
          const card2X = (toNode.x + relNode.x) / 2;
          const card2Y = (toNode.y + relNode.y) / 2;
          
          return (
            <g key={`card-${i}`}>
               <text x={card1X} y={card1Y+5} textAnchor="middle" fill="red" fontSize="16" fontWeight="bold">{fromCard}</text>
               <text x={card2X} y={card2Y+5} textAnchor="middle" fill="red" fontSize="16" fontWeight="bold">{toCard}</text>
            </g>
          )
      })}
    </svg>
  );
}