import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { DefinitionNode } from './TableNode';
import { Relationships } from './Relationships';
import { useSchemaStore } from '../store/schemaStore';

export function SchemaVisualizer() {
  const { schema } = useSchemaStore();

  useEffect(() => {
    // Position definitions in a circle
    const radius = 6; // Increased radius for more spacing
    const angleStep = (2 * Math.PI) / schema.definitions.length;
    
    schema.definitions.forEach((def, i) => {
      const angle = i * angleStep;
      def.position = [
        radius * Math.cos(angle),
        0,
        radius * Math.sin(angle),
      ];
    });
  }, [schema.definitions]);

  return (
    <div className="w-full h-screen">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 12, 16]} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          minDistance={8}
          maxDistance={30}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Relationships />
        {schema.definitions.map((definition) => (
          <DefinitionNode
            key={definition.name}
            definition={definition}
            position={definition.position!}
          />
        ))}
      </Canvas>
    </div>
  );
}