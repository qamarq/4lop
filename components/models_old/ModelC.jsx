import { PresentationControls, useGLTF } from '@react-three/drei';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import React from 'react';

export const ModelC = () => {
    const dracoLoader = new DRACOLoader();
    console.log("tooo")
    dracoLoader.setDecoderPath('/draco-gltf/');
    const modelC = useGLTF(
        "/configurator/stol_nozem/glb/C.glb",
        dracoLoader
    );

    return (
        <>
            <PresentationControls
                global
                polar={[-0.4, 0.2]}
                azimuth={[-0.4, 0.2]}>
                <primitive object={modelC.scene} position-y={1.2}></primitive>
            </PresentationControls>
        </>
    );
};