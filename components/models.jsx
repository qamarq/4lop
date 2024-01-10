import { PresentationControls, useGLTF } from '@react-three/drei';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import React from 'react';

// Model
export const Model = ({ path, letter }) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco-gltf/');
    const model = useGLTF(
        `/configurator/${path}/glb/${letter}.glb`,
        dracoLoader
    );

    return (
        <>
            <PresentationControls
                global
                polar={[-0.4, 0.2]}
                speed={0}
                azimuth={[-0.4, 0.2]}>
                <primitive object={model.scene} position-y={1.2}></primitive>
            </PresentationControls>
        </>
    );
};

// Dodatki
export const Addon = ({ path, number }) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco-gltf/');
    const model = useGLTF(
        `/configurator/${path}/glb/${number}.glb`,
        dracoLoader
    );

    return (
        <>
            <PresentationControls
                global
                polar={[-0.4, 0.2]}
                speed={0}
                azimuth={[-0.4, 0.2]}>
                <primitive object={model.scene} position-y={1.2}></primitive>
            </PresentationControls>
        </>
    );
};