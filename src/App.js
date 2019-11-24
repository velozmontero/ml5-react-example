import React, { useState, useCallback, useEffect } from 'react';
import * as ml5 from 'ml5';
import ImageUploader from 'react-images-upload';
import Img from 'react-image'
import logo from './logo.svg';
import './App.css';

export default function App() {
  const [images, setImages] = useState([]);

  const classifyImage = async files => {
    const src = window.URL.createObjectURL(files[files.length - 1]);
    const classifier = await ml5.imageClassifier('MobileNet');

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.width = 224;
    img.height = 224;
    img.onload = () => {
      classifier.predict(img, 1, (err, results) => {
        if (err) {
          return console.error(err);
        }

        const [prediction] = results;
        setImages(images => images.concat([{ file: files[0], src, prediction }]));
      })
    }
  }

  return (
    <div className="App">
      <div className="App-content">
        <div className="images">
          {images.map(({ src, prediction: { label, confidence } }, i) => (
            <div key={i} className="image">
              <Img
                height={400}
                src={[
                  src,
                  logo
                ]}
              />
              <div>Label: {label}</div>
              <div>Confidence: {Math.round(confidence * 100)}%</div>
            </div>
            
          ))}
        </div>

        <div className="image-uploader">
          <p>
            ML5 Version {ml5.version}
          </p>

          <div style={{
            width: '320px',
            height: '50px',
            color: '#282c34'
          }}>
            <ImageUploader
              withIcon
              singleImage
              buttonText='Choose image'
              onChange={classifyImage}
              imgExtension={['.jpg', '.gif', '.png', '.gif']}
              maxFileSize={5242880}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
