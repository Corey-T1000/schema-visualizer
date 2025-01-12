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
        args={[0.8, 32, 32]}
        onClick={() => setSelectedDefinition(isSelected ? null : definition.name)}
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
          color={isSelected ? '#ff6b6b' : isHighlighted ? '#4dabf7' : '#3b82f6'}
          roughness={0.3}
          metalness={0.7}
          emissive={isSelected || isHighlighted ? '#ffffff' : '#3b82f6'}
          emissiveIntensity={0.4}
          transparent
          opacity={0.9}
        />
      </Sphere>
      {(hovered || isSelected) && (
        <Html
          position={[0, 1.2, 0]}
          center
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: 'auto',
            minWidth: '240px',
            pointerEvents: 'none',
            color: 'white',
            fontSize: '14px'
          }}
          distanceFactor={12}
        >
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{definition.name} <span className="text-sm text-white/60">({definition.relations.length})</span></h3>
            {definition.relations.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-white/80 mb-1">Relations:</h4>
                <div className="space-y-1">
                  {definition.relations.map((relation) => (
                    <div key={relation.name} className="text-sm">
                      <span className="text-blue-400">{relation.name}</span>
                      <span className="text-white/60">: {relation.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {definition.permissions.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-white/80 mb-1">Permissions:</h4>
                <div className="space-y-1">
                  {definition.permissions.map((permission) => (
                    <div key={permission.name} className="text-sm">
                      <span className="text-purple-400">{permission.name}</span>
                      <span className="text-white/60"> = {permission.expression}</span>
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
