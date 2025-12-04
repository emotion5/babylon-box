import { useEffect, useRef } from 'react'
import { Engine, Scene, ArcRotateCamera, HemisphericLight, Vector3, SceneLoader } from '@babylonjs/core'
import '@babylonjs/loaders/glTF'

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
      5,
      new Vector3(0, 0, 0),
      scene
    )
    camera.attachControl(canvas, true)

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
      engine.dispose()
    }
  }, [])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !sceneRef.current) return

    const scene = sceneRef.current
    scene.meshes.forEach(mesh => mesh.dispose())

    const url = URL.createObjectURL(file)
    try {
      await SceneLoader.ImportMeshAsync('', '', url, scene, undefined, '.glb')
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <input
        type="file"
        accept=".glb,.gltf"
        onChange={handleFileChange}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      />
    </div>
  )
}

export default GLBLoader
