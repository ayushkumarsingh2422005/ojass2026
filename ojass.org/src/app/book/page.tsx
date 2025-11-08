"use client";

import { Experience } from "@/components/book/Experience";
import { UI } from "@/components/book/UI";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";

function App() {
    const [cameraZ, setCameraZ] = useState(6);

    useEffect(() => {
        const handleResize = () => setCameraZ(window.innerWidth > 800 ? 4 : 9);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className="h-screen w-screen"
            style={{
                background: "radial-gradient(#5a47ce, #232323 80%)",
            }}>
            <UI />
            <Loader />
            <Canvas
                shadows
                camera={{
                    position: [-0.5, 1, cameraZ],
                    fov: 45,
                }}>
                <group position-y={0}>
                    <Suspense fallback={null}>
                        <Experience />
                    </Suspense>
                </group>
            </Canvas>
        </div>
    );
}

export default App;
