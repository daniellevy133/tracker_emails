import * as fs from 'fs';
import * as path from 'path';



class FilesHandler {
    private csvParser = require('csv-parser');

    async readCSV(file:any){
        const readStream = fs.createReadStream(file.path).pipe(this.csvParser());
        const arrayChun=[];
        try{
            for await (const chunk of readStream){
                arrayChun.push(chunk);
            }
            await this.removeFilesStream('uploads');
        } catch(err){
            throw err;
        }
        return arrayChun;
    }

    checkSuffixes(string:any,suffixes:string[]){
        return suffixes.some(suffix=>{ return string.endsWith(suffix); })
    }

    async saveToFile(fileName:string,data:any){
        try{
            await fs.writeFileSync(fileName,data)
        }catch(err){
            throw (err);
        }
    }

    async removeFile(directory:string,file:string){
        try{
            await fs.unlinkSync(path.join(directory,file));
        }catch(err){
            throw err;
        }
    }

    private async removeFilesStream(directory:string)
    {
        try{
            const files= await fs.readdirSync(directory);
            for (const file of files) {
                await this.removeFile(directory,file);
            }
        }catch(err){
            throw err;
        }
    }
}
export default FilesHandler;