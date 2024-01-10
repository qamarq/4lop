import { PresentationControls, useGLTF } from '@react-three/drei';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import React from 'react';

export const ModelA = () => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco-gltf/');
    const modelA = useGLTF(
        "/configurator/stol_podst/glb/A.glb",
        dracoLoader
    );

    return (
        <>
            <PresentationControls
                global
                polar={[-0.4, 0.2]}
                azimuth={[-0.4, 0.2]}>
                <primitive object={modelA.scene} position-y={1.2}></primitive>
            </PresentationControls>
        </>
    );
};
