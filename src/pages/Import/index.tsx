import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (!uploadedFiles.length) {
      return;
    }

    setIsUploading(true);

    const uploadRequests: Promise<void>[] = [];

    uploadedFiles.forEach(uploadFile => {
      const data = new FormData();

      data.append('file', uploadFile.file);

      const uploadRequest = api.post('/transactions/import', data) as Promise<
        void
      >;

      uploadRequests.push(uploadRequest);
    });

    Promise.all(uploadRequests)
      .then(() => {
        history.push('/');
      })
      .catch(err => console.error(err))
      .finally(() => {
        setIsUploading(false);
      });
  }

  function submitFile(files: File[]): void {
    setUploadedFiles(
      files.map<FileProps>(file => {
        return {
          file,
          name: file.name,
          readableSize: filesize(file.size),
        };
      }),
    );
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button" disabled={isUploading || uploadedFiles.length === 0}>
              {!isUploading ? 'Enviar' : 'Enviando...'}
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
