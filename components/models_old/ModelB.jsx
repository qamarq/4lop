import { PresentationControls, useGLTF } from '@react-three/drei';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import React from 'react';

export const ModelB = () => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco-gltf/');
    const modelB = useGLTF(
        "/configurator/stol_warsztat/glb/B.glb",
        dracoLoader
    );

    return (
        <>
            <PresentationControls
                global
                polar={[-0.4, 0.2]}
                azimuth={[-0.4, 0.2]}>
                <primitive object={modelB.scene} position-y={1.2}></primitive>
            </PresentationControls>
        </>
    );
};

// Dodatki
export const Addon = ({ number }) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco-gltf/');
    const modelB = useGLTF(
        `/configurator/stol_warsztat/glb/${number}.glb`,
        dracoLoader
    );

    return (
        <>
            <PresentationControls
                global
                polar={[-0.4, 0.2]}
                azimuth={[-0.4, 0.2]}>
                <primitive object={modelB.scene} position-y={1.2}></primitive>
            </PresentationControls>
        </>
    );
};