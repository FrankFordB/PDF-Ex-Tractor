import React, { useState, useEffect } from 'react'

export default function WelcomeModal({ visible = true, onClose }) {
  const [show, setShow] = useState(visible)
  const [locked, setLocked] = useState(false)
  // imagen fija para mostrar cuando el usuario elige "Yo ni cagando"
  const LOCK_IMAGE = 'https://thumb.luxuretv.com/thumbs/5/5/f/9/e/55f92f792af610593281330.mp4/55f92f792af610593281330.mp4-6b.jpg'
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    setShow(visible)
  }, [visible])

  if (!show && !locked) return null

  const openWhatsApp = () => {
    // número Argentina: 54 + 2604312716 => 542604312716
    const phone = '+542604312716'
    const text = encodeURIComponent('yo tambien ❤️‍🩹❤️')
    const url = `https://wa.me/${phone}?text=${text}`
    window.open(url, '_blank')
    // cerrar modal después de redireccionar
    setShow(false)
    onClose && onClose()
  }

  const lockWithImage = () => {
    setLocked(true)
  }

  // no permitimos agregar imagen desde el modal; usaremos la imagen fija al bloquear

  // Si está locked mostramos sólo la imagen en pantalla completa y sin botones
  if (locked) {
    const src = imageSrc || LOCK_IMAGE
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
        <div className="max-w-full max-h-full p-4">
          <img src={src} alt="Imagen" className="object-contain max-w-full max-h-[96vh] mx-auto rounded shadow-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <style>{`\n        .heart { width:18px;height:18px;color:#ff5c8a;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.25)); }\n        @keyframes floaty { 0%{ transform: translateY(0) } 50%{ transform: translateY(-8px) } 100%{ transform: translateY(0) } }\n        .heart-anim { animation: floaty 2s ease-in-out infinite; }\n      `}</style>

      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 to-pink-100 opacity-95" />

      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 overflow-hidden">
        {/* hearts decor */}
        <div className="absolute -top-6 -left-4 opacity-90 heart-anim">
          <svg className="heart" viewBox="0 0 24 24" fill="#ff5c8a" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6.716-4.35-9.07-7.07C-0.04 11.949 1.1 6.5 6 5.5 8.13 5 10 6.1 12 8c2-1.9 3.87-3 6-2.5 4.9 1 6.04 6.45 3.07 8.43C18.716 16.65 12 21 12 21z"/></svg>
        </div>
        <div className="absolute -bottom-6 -right-6 opacity-90 heart-anim" style={{ animationDelay: '0.6s' }}>
          <svg className="heart" viewBox="0 0 24 24" fill="#ff6b9c" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6.716-4.35-9.07-7.07C-0.04 11.949 1.1 6.5 6 5.5 8.13 5 10 6.1 12 8c2-1.9 3.87-3 6-2.5 4.9 1 6.04 6.45 3.07 8.43C18.716 16.65 12 21 12 21z"/></svg>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold mb-2 text-pink-700 flex items-center gap-3">Hola Hermosa <span className="text-2xl">💖</span></h2>
          <p className="mb-4 text-pink-900/80">Quería contarte algo desde el corazón: Tu perfume me gusta asi, simplemente un poco de ti. Fluir - Etéreos. te cuido y, por encima de todo... te quiero.</p>
<p className="text-sm text-black-1800">Diseñado, creado y pensado by Franco Burgoa</p>
          <div className="flex gap-3 justify-end mt-4">
            <button onClick={openWhatsApp} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full shadow hover:scale-[1.02] transition">Yo tambien ❤️</button>
            <button onClick={lockWithImage} className="px-4 py-2 bg-red-700 text-white rounded-full shadow hover:scale-[1.02] transition">Yo ni cagando</button>
          </div>
        </div>
      </div>
    </div>
  )
}
