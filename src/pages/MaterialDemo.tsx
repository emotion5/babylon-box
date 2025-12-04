import { useEffect, useRef, useState } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Color4, Mesh } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import styles from './MaterialDemo.module.css' // CSS 모듈을 사용할 예정

function MaterialDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  const boxRef = useRef<Mesh | null>(null) // Mesh 타입

  const [isOutlineMode, setIsOutlineMode] = useState(false)

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
    camera.invertRotation = false // 초기값은 반전 없음

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    // Box 생성
    const box = MeshBuilder.CreateBox('box', { size: 2 }, scene)
    boxRef.current = box

    // Materials
    const solidMaterial = new StandardMaterial('solidMaterial', scene)
    solidMaterial.diffuseColor = new Color3(0.4, 0.4, 1) // Blue color
    box.material = solidMaterial // 기본은 솔리드

    // Edge Rendering 설정 (초기에는 비활성화)
    box.disableEdgesRendering()
    box.edgesWidth = 1 // 엣지 두께
    box.edgesColor = new Color4(1, 0, 0, 1) // Red color

    engine.runRenderLoop(() => {
      scene.render()
    })

    const handleResize = () => {
      engine.resize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      sceneRef.current = null
      if (engineRef.current) {
        engineRef.current.dispose()
      }
    }
  }, [])

  useEffect(() => {
    if (boxRef.current && sceneRef.current) {
      if (isOutlineMode) {
        const scene = sceneRef.current! // 씬 참조
        const invisibleMaterial = new StandardMaterial('invisibleMaterial', scene);
        invisibleMaterial.alpha = 0;
        boxRef.current.material = invisibleMaterial;
        boxRef.current.enableEdgesRendering();
      } else {
        const scene = sceneRef.current! // 씬 참조
        const solidMaterial = new StandardMaterial('solidMaterial', scene);
        solidMaterial.diffuseColor = new Color3(0.4, 0.4, 1); // Blue color
        boxRef.current.material = solidMaterial; // 솔리드 머터리얼 적용
        boxRef.current.disableEdgesRendering();
      }
    }
  }, [isOutlineMode])

  const toggleMode = () => {
    setIsOutlineMode(prev => !prev)
  }

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <button onClick={toggleMode} className={styles.toggleButton}>
        {isOutlineMode ? 'Show Solid' : 'Show Outline'}
      </button>
    </div>
  )
}

export default MaterialDemo
