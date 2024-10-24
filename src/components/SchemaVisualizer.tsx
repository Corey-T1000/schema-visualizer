import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DefinitionNode } from './TableNode';
import { Relationships } from './Relationships';
import { useSchemaStore } from '../store/schemaStore';
import { Color } from 'three';

export function SchemaVisualizer() {
  const { 
    schema, 
    filteredDefinitions, 
    setFilteredDefinitions,
  } = useSchemaStore();

  // Initialize filteredDefinitions and set positions
  useEffect(() => {
    if (schema.definitions.length > 0) {
      const radius = Math.max(8, schema.definitions.length * 1.2);
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
    <div className="relative w-full h-screen pl-12">
      <Canvas
        gl={{ alpha: false, antialias: true }}
        camera={{ 
          position: [0, 20, 25],
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{
          position: 'absolute',
          inset: 0,
          touchAction: 'none'
        }}
      >
        <color attach="background" args={[new Color('#0F172A')]} />
        <fog attach="fog" args={['#0F172A', 30, 50]} />
        
        <OrbitControls
          makeDefault
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={15}
          maxDistance={40}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.5}
          enablePan={true}
          panSpeed={0.8}
          target={[0, 0, 0]}
        />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.7} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
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
