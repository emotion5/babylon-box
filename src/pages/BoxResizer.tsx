import { useEffect, useRef, useState } from 'react'
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, Mesh } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import styles from './BoxResizer.module.css'

function BoxResizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Engine | null>(null)
  const sceneRef = useRef<Scene | null>(null)
  const boxRef = useRef<Mesh | null>(null) // Mesh 타입

  const [boxDimensions, setBoxDimensions] = useState({ x: 2, y: 2, z: 2 })

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
    camera.invertRotation = false

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    // Box 생성
    const box = MeshBuilder.CreateBox('box', {
      width: boxDimensions.x,
      height: boxDimensions.y,
      depth: boxDimensions.z
    }, scene)
    boxRef.current = box

    const material = new StandardMaterial('material', scene)
    material.diffuseColor = new Color3(0.1, 0.7, 0.9) // Cyan-ish color
    box.material = material

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // boxDimensions가 변경될 때마다 박스 크기 업데이트
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scaling.x = boxDimensions.x / 2
      boxRef.current.scaling.y = boxDimensions.y / 2
      boxRef.current.scaling.z = boxDimensions.z / 2
    }
  }, [boxDimensions.x, boxDimensions.y, boxDimensions.z])

  const handleDimensionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value)
    setBoxDimensions(prev => ({
      ...prev,
      [axis]: isNaN(numValue) ? 0 : numValue,
    }))
  }

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.controls}>
        <label>
          X:
          <input
            type="number"
            value={boxDimensions.x}
            onChange={(e) => handleDimensionChange('x', e.target.value)}
            step="0.1"
            className={styles.dimensionInput}
          />
        </label>
        <label>
          Y:
          <input
            type="number"
            value={boxDimensions.y}
            onChange={(e) => handleDimensionChange('y', e.target.value)}
            step="0.1"
            className={styles.dimensionInput}
          />
        </label>
        <label>
          Z:
          <input
            type="number"
            value={boxDimensions.z}
            onChange={(e) => handleDimensionChange('z', e.target.value)}
            step="0.1"
            className={styles.dimensionInput}
          />
        </label>
      </div>
    </div>
  )
}

export default BoxResizer
