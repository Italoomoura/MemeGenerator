const imageUpload = document.getElementById('imageUpload');
const selectedImageContainer = document.getElementById('selectedImageContainer');
const memeCanvas = document.getElementById('memeCanvas');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const generateMemeBtn = document.getElementById('generateMeme');
const shareMemeBtn = document.getElementById('shareMeme');
const textColorPicker = document.getElementById('textColorPicker');
const fontSizeInputTop = document.getElementById('fontSizeTop');
const fontSizeInputBottom = document.getElementById('fontSizeBottom');
const downloadMemeBtn = document.getElementById('downloadMeme');

const ctx = memeCanvas.getContext('2d');


imageUpload.addEventListener('change', handleImageUpload);
generateMemeBtn.addEventListener('click', generateMeme);
downloadMemeBtn.addEventListener('click', downloadMeme);

function displayErrorMessage(message) {
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
  
    const container = document.querySelector('.container');
    container.appendChild(errorMessage);
  
    setTimeout(() => {
        errorMessage.remove();
    }, 3000);
}

function downloadMeme() {
    const generatedImage = memeCanvas.toDataURL('image/png');

    const downloadLink = document.createElement('a');
    downloadLink.href = generatedImage;
    downloadLink.download = 'meme.png';

    downloadLink.click();
}

function handleImageUpload(event) {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const img = new Image();
                img.src = event.target.result;
                img.onload = function() {
                    selectedImageContainer.innerHTML = '';
                    const imageElement = document.createElement('img');
                    imageElement.src = img.src;
                    selectedImageContainer.appendChild(imageElement);
                };
            };
            img.onerror = function() {
                displayErrorMessage('Erro: Imagem inválida');
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(selectedImage);
    } else {
        displayErrorMessage('Erro: Nenhuma imagem selecionada');
    }
}


function generateMeme() {
    const reader = new FileReader();
  
    reader.onload = function(event) {
      const img = new Image();
      img.onload = function() {
        memeCanvas.width = img.width;
        memeCanvas.height = img.height;
        ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
        ctx.drawImage(img, 0, 0);
  
        ctx.fillStyle = textColorPicker.value; 
        const fontSizeTop = parseInt(fontSizeInputTop.value) || 36;
        ctx.font = `${fontSizeTop}px Impact`;
        ctx.textAlign = 'center';
  
        ctx.fillText(topText.value.toUpperCase(), memeCanvas.width / 2, 40);
        ctx.strokeText(topText.value.toUpperCase(), memeCanvas.width / 2, 40);
  
        ctx.fillStyle = textColorPicker.value;
        const fontSizeBottom = parseInt(fontSizeInputBottom.value) || 36;
        ctx.font = `${fontSizeBottom}px Impact`;
        ctx.textAlign = 'center';
  
        ctx.fillText(bottomText.value.toUpperCase(), memeCanvas.width / 2, memeCanvas.height - 20);
        ctx.strokeText(bottomText.value.toUpperCase(), memeCanvas.width / 2, memeCanvas.height - 20);
  
        const generatedImage = new Image();
        generatedImage.src = memeCanvas.toDataURL('image/png');
  
        selectedImageContainer.innerHTML = '';
        
        selectedImageContainer.appendChild(generatedImage);
        selectedImageContainer.style.display = 'block';
      };
      img.src = event.target.result;
    };
  
    if (imageUpload.files[0]) {
      reader.readAsDataURL(imageUpload.files[0]);
    }
  }


shareMemeBtn.addEventListener('click', () => {
  const dataUrl = memeCanvas.toDataURL('image/png');
  const blob = dataURItoBlob(dataUrl);
  const filesArray = [new File([blob], 'meme.png', { type: 'image/png' })];

  if (navigator.share && navigator.canShare({ files: filesArray })) {
    navigator.share({
      files: filesArray,
      title: 'Meme gerado',
    })
    .catch((error) => console.error('Erro ao compartilhar:', error));
  } else {
    console.error('A API de compartilhamento não está disponível');
  }
});


function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
}
