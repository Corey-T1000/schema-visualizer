import { Line } from '@react-three/drei';
import { useSchemaStore } from '../store/schemaStore';

export function Relationships() {
  const { filteredDefinitions, selectedDefinition, hoveredDefinition } = useSchemaStore();

  const relationships = filteredDefinitions.flatMap((def) =>
    def.relations.flatMap((relation) => {
      const targetTypes = relation.type.split('|').map(t => t.trim());
      return targetTypes.map(targetType => {
        const [base] = targetType.split('#');
        return {
          from: def.name,
          to: base,
          type: targetType.includes('#') ? 'inheritance' : 'reference',
          relation: relation.name,
        };
      });
    })
  ).filter(rel => filteredDefinitions.some(def => def.name === rel.to));

  return (
    <>
      {relationships.map((rel, idx) => {
        const fromDef = filteredDefinitions.find(d => d.name === rel.from);
        const toDef = filteredDefinitions.find(d => d.name === rel.to);
        
        if (!fromDef?.position || !toDef?.position) return null;

        const isHighlighted =
          selectedDefinition === rel.from ||
          selectedDefinition === rel.to ||
          hoveredDefinition === rel.from ||
          hoveredDefinition === rel.to;

        const color = rel.type === 'inheritance' ? '#be4bdb' : '#ff6b6b';

        return (
          <Line
            key={`${rel.from}-${rel.to}-${rel.relation}-${idx}`}
            points={[fromDef.position, toDef.position]}
            color={isHighlighted ? color : '#868e96'}
            lineWidth={isHighlighted ? 2 : 1}
            opacity={isHighlighted ? 1 : 0.5}
            transparent
          />
        );
      })}
    </>
  );
}
