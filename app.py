from flask import Flask, request, render_template, send_from_directory
import os
import subprocess

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['COMPRESSED_FOLDER'] = 'compressed'

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['COMPRESSED_FOLDER'], exist_ok=True)

def compress_pdf(input_pdf, output_pdf, quality):
    command = [
        "C:\\Program Files\\gs\\gs10.04.0\\bin\\gswin64c.exe",
        "-sDEVICE=pdfwrite",
        f"-dPDFSETTINGS=/{quality}",
        "-dNOPAUSE",
        "-dQUIET",
        "-dBATCH",
        f"-sOutputFile={output_pdf}",
        input_pdf
    ]

    print("Comando: ", " ".join(command))

    try:
        subprocess.run(command, check=True)
    except FileNotFoundError as e:
        print(f"Erro: {e}")
        raise
    except subprocess.CalledProcessError as e:
        print(f"Erro ao executar o Ghostscript: {e}")
        raise

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'Nenhum arquivo enviado.', 400

        file = request.files['file']
        if file.filename == '':
            return 'Nenhum arquivo selecionado.', 400

        if file:
            input_pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            output_pdf_path = os.path.join(app.config['COMPRESSED_FOLDER'], 'compressed_' + file.filename)
            file.save(input_pdf_path)
            quality = request.form.get('quality', 'screen')
            try:
                compress_pdf(input_pdf_path, output_pdf_path, quality)
                return send_from_directory(app.config['COMPRESSED_FOLDER'], 'compressed_' + file.filename, as_attachment=True)
            except Exception as e:
                return f'Ocorreu um erro ao comprimir o PDF: {e}', 500
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)