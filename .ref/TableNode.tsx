import { useState, useRef } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Definition } from '../types/schema';
import { useSchemaStore } from '../store/schemaStore';

interface DefinitionNodeProps {
  definition: Definition;
  position: [number, number, number];
}

export function DefinitionNode({ definition, position }: DefinitionNodeProps) {
  const { selectedDefinition, hoveredDefinition, setSelectedDefinition, setHoveredDefinition } = useSchemaStore();
  const sphereRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const isSelected = selectedDefinition === definition.name;
  const isHighlighted = hoveredDefinition === definition.name;

  useFrame((state) => {
    if (sphereRef.current && (isSelected || isHighlighted)) {
      sphereRef.current.scale.lerp(
        { x: 1.2, y: 1.2, z: 1.2 },
        0.1
      );
    } else if (sphereRef.current) {
      sphereRef.current.scale.lerp(
        { x: 1, y: 1, z: 1 },
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={sphereRef}
        args={[0.5, 32, 32]}
        onClick={() => setSelectedDefinition(definition.name)}
        onPointerOver={() => {
          setHovered(true);
          setHoveredDefinition(definition.name);
        }}
        onPointerOut={() => {
          setHovered(false);
          setHoveredDefinition(null);
        }}
      >
        <meshStandardMaterial
          color={isSelected ? '#ff6b6b' : isHighlighted ? '#4dabf7' : '#228be6'}
          roughness={0.3}
          metalness={0.8}
        />
      </Sphere>
      {(hovered || isSelected) && (
        <Html position={[0, 0.8, 0]} center>
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg max-w-sm">
            <h3 className="font-bold text-gray-800">spicedbisforme/{definition.name}</h3>
            {definition.relations.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-600">Relations:</h4>
                <div className="space-y-1">
                  {definition.relations.map((relation) => (
                    <div key={relation.name} className="text-sm">
                      <span className="text-blue-600">{relation.name}</span>
                      <span className="text-gray-400">: {relation.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {definition.permissions.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-600">Permissions:</h4>
                <div className="space-y-1">
                  {definition.permissions.map((permission) => (
                    <div key={permission.name} className="text-sm">
                      <span className="text-purple-600">{permission.name}</span>
                      <span className="text-gray-400"> = {permission.expression}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}