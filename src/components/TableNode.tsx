import { useState, useRef } from 'react';
import { Sphere, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Definition } from '../types/schema';
import { useSchemaStore } from '../store/schemaStore';
import { Vector3 } from 'three';

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

  useFrame(() => {
    if (sphereRef.current && (isSelected || isHighlighted)) {
      sphereRef.current.scale.lerp(
        new Vector3(1.4, 1.4, 1.4),
        0.1
      );
    } else if (sphereRef.current) {
      sphereRef.current.scale.lerp(
        new Vector3(1, 1, 1),
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={sphereRef}
        args={[0.6, 32, 32]}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedDefinition(isSelected ? null : definition.name);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHoveredDefinition(definition.name);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          setHoveredDefinition(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial
          color={isSelected ? '#ff6b6b' : isHighlighted ? '#4dabf7' : '#228be6'}
          roughness={0.3}
          metalness={0.8}
          emissive={isSelected || isHighlighted ? '#ffffff' : '#000000'}
          emissiveIntensity={0.2}
        />
      </Sphere>
      {(hovered || isSelected) && (
        <Html
          position={[0, 1.2, 0]}
          center
          style={{
            pointerEvents: 'none',
            transform: 'scale(1)',
            transformOrigin: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            width: 'auto',
            minWidth: '200px',
          }}
          distanceFactor={12}
        >
          <div className="bg-white rounded-lg">
            <h3 className="font-bold text-gray-800 text-lg mb-2">spicedbisforme/{definition.name}</h3>
            {definition.relations.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-semibold text-gray-600">Relations:</h4>
                <div className="space-y-1">
                  {definition.relations.map((relation) => (
                    <div key={relation.name} className="text-sm">
                      <span className="text-blue-600 font-medium">{relation.name}</span>
                      <span className="text-gray-500">: {relation.type}</span>
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
                      <span className="text-purple-600 font-medium">{permission.name}</span>
                      <span className="text-gray-500"> = {permission.expression}</span>
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
