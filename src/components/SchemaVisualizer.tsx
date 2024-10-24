import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DefinitionNode } from './TableNode';
import { Relationships } from './Relationships';
import { useSchemaStore } from '../store/schemaStore';

export function SchemaVisualizer() {
  const { 
    schema, 
    filteredDefinitions, 
    setFilteredDefinitions,
  } = useSchemaStore();

  useEffect(() => {
    if (schema.definitions.length > 0) {
      const radius = Math.max(6, schema.definitions.length * 0.8);
      const angleStep = (2 * Math.PI) / schema.definitions.length;
      
      const definitionsWithPositions = schema.definitions.map((def, i) => {
        const angle = i * angleStep;
        return {
          ...def,
          position: [
            radius * Math.cos(angle),
            0,
            radius * Math.sin(angle),
          ] as [number, number, number]
        };
      });

      setFilteredDefinitions(definitionsWithPositions);
    }
  }, [schema.definitions, setFilteredDefinitions]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{
          position: [0, 15, 20],
          fov: 50
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#0F172A');
        }}
      >
        <OrbitControls />
        
        {/* Ambient light for base illumination */}
        <ambientLight intensity={0.7} />
        
        {/* Key light */}
        <pointLight position={[10, 15, 10]} intensity={1} />
        
        {/* Fill light */}
        <pointLight position={[-10, 10, -10]} intensity={0.8} />
        
        {/* Rim light for depth */}
        <pointLight position={[0, -10, 0]} intensity={0.5} />

        <group>
          <Relationships />
          {filteredDefinitions.map((definition) => (
            definition.position && (
              <DefinitionNode
                key={definition.name}
                definition={definition}
                position={definition.position}
              />
            )
          ))}
        </group>
      </Canvas>
    </div>
  );
}
