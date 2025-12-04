import { useEffect, useRef } from 'react'
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'
import styles from './GLBLoader.module.css'

function GLBLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<Scene | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const engine = new Engine(canvas, true)
    const scene = new Scene(engine)
    sceneRef.current = scene

    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      2,
      new Vector3(0, 0, 0),
      scene
    )
    camera.attachControl(canvas, false)
    camera.wheelPrecision = -50
    camera.invertRotation = true

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

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
      scene.dispose()
      engine.dispose()
    }
  }, [])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !sceneRef.current) return

    const scene = sceneRef.current
    scene.meshes.forEach(mesh => mesh.dispose())

    const objectUrl = URL.createObjectURL(file)
    // Extract file extension to help SceneLoader choose the correct plugin
    const fileExtension = '.' + file.name.split('.').pop()

    try {
      await SceneLoader.ImportMeshAsync('', '', objectUrl, scene, undefined, fileExtension)
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }

  return (
    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <input
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </div>
  )
}

export default GLBLoader
