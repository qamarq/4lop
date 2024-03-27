import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button } from './ui/button';

type Props = {
    onFileChange: (file: File) => void;
    accept?: ('.pdf' | '.doc' | '.docx' | '.xls' | '.xlsx' | '.ppt' | '.pptx' | '.jpg' | '.jpeg' | '.png' | '.gif')[]
};

const FileUpload = ({ onFileChange, accept }: Props) => {
    const [dragActive, setDragActive] = React.useState(false);
    const [file, setFile] = React.useState<File | null>(null);

    const inputRef = React.useRef<HTMLInputElement>(null);
  
    const handleDrag = function(e: any) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
  
    const handleDrop = function(e: any) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileChange(e.dataTransfer.files[0]);
            setFile(e.dataTransfer.files[0]);
        }
    };
  
    const handleChange = function(e: any) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
            setFile(e.target.files[0]);
        }
    };
  
    const onButtonClick = () => {
        inputRef.current && inputRef.current.click();
    };

    return (
        <div className="w-full bg-muted/30">
            <form className='h-[25rem] w-full max-w-[50rem] text-center relative' onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input ref={inputRef} type="file" accept="image/*" className='hidden' multiple={false} onChange={handleChange} />
                <label htmlFor="input-file-upload" className={cn("h-full flex items-center justify-center border-[2px] rounded-lg border-dashed border-[#cbd5e1] transition-all", { "bg-[#00000021]": dragActive, "bg-glass-bg": !dragActive })}>
                    <div>
                        {file ? (
                            <div className='flex flex-col justify-center items-center'>
                                <FileIcon size={30} />
                                <h1 className='font-normal text-sm mt-4 leading-relaxed'>Wybrano plik: <br/><span className='font-bold text-md'>{file.name}</span></h1>
                            </div>
                        ) : (
                            <>
                                <p className='font-medium mb-2'>Przeciągnij plik lub kliknij poniżej</p>
                                <Button onClick={onButtonClick} color='primary' type='button'>
                                    <FileIcon className='w-3 h-3 mr-1' />
                                    Wybierz plik
                                </Button>
                            </>
                        )}
                    </div> 
                </label>
                { dragActive && <div className='absolute w-full h-full top-0.5' onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
            </form>
        </div>
    );
};

export default FileUpload;
