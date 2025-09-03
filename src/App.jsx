import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export default function App() {
  const [texto, setTexto] = useState('')

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>ISFD Cecilia Braslavsky</h1>
      <p>Editor con ReactQuill</p>

      <ReactQuill
        theme="snow"
        value={texto}
        onChange={setTexto}
        style={{ height: '200px', marginBottom: '40px' }}
      />

      <h3>Vista previa:</h3>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 10,
          borderRadius: 4,
          background: '#fafafa'
        }}
        dangerouslySetInnerHTML={{ __html: texto }}
      />
    </div>
  )
}

