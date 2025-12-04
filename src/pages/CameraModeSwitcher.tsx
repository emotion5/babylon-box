import { useEffect, useRef, useState } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Camera } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import styles from './CameraModeSwitcher.module.css'

function CameraModeSwitcher() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  const cameraRef = useRef<ArcRotateCamera | null>(null)

  const [isPerspective, setIsPerspective] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const engine = new Engine(canvas, true)
    engineRef.current = engine
    const scene = new Scene(engine)
    sceneRef.current = scene

    const camera = new ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2.5,
      5,
      new Vector3(0, 0, 0),
      scene
    )
    camera.attachControl(canvas, true)
    camera.wheelPrecision = 50
    camera.invertRotation = false // 기본값은 반전 없음
    cameraRef.current = camera

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    // Box 생성
    const box = MeshBuilder.CreateBox('box', { size: 2 }, scene)
    const material = new StandardMaterial('material', scene)
    material.diffuseColor = new Color3(0.1, 0.7, 0.9) // Cyan-ish color
    box.material = material

    engine.runRenderLoop(() => {
      scene.render()
    })

    const handleResize = () => {
      engine.resize()
      // Orthographic camera needs to re-adjust on resize
      if (cameraRef.current && cameraRef.current.mode === Camera.ORTHOGRAPHIC_CAMERA) {
        const aspectRatio = engine.getRenderHeight() / engine.getRenderWidth();
        cameraRef.current.orthoLeft = -5;
        cameraRef.current.orthoRight = 5;
        cameraRef.current.orthoBottom = -5 * aspectRatio;
        cameraRef.current.orthoTop = 5 * aspectRatio;
      }
    }
    window.addEventListener('resize', handleResize)
    
    // Initial ortho setup
    if (cameraRef.current && cameraRef.current.mode === Camera.ORTHOGRAPHIC_CAMERA) {
      handleResize();
    }


    return () => {
      window.removeEventListener('resize', handleResize)
      sceneRef.current = null
      if (engineRef.current) {
        engineRef.current.dispose()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (cameraRef.current && engineRef.current) {
      if (isPerspective) {
        cameraRef.current.mode = Camera.PERSPECTIVE_CAMERA
      } else {
        cameraRef.current.mode = Camera.ORTHOGRAPHIC_CAMERA
        // Reset to Front View
        cameraRef.current.alpha = -Math.PI / 2;
        cameraRef.current.beta = Math.PI / 2;
        
        const aspectRatio = engineRef.current.getRenderHeight() / engineRef.current.getRenderWidth();
        // Adjust these values based on your scene scale
        cameraRef.current.orthoLeft = -5;
        cameraRef.current.orthoRight = 5;
        cameraRef.current.orthoBottom = -5 * aspectRatio;
        cameraRef.current.orthoTop = 5 * aspectRatio;
      }
    }
  }, [isPerspective])

  const toggleCameraMode = () => {
    setIsPerspective(prev => !prev)
  }

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <button onClick={toggleCameraMode} className={styles.toggleButton}>
        Switch to {isPerspective ? 'Orthographic' : 'Perspective'}
      </button>
    </div>
  )
}

export default CameraModeSwitcher
