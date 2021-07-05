(function()  {

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);
    
        abrirConexion.onerror = function() {
            console.log('Error al conectarse a la base de Datos | Agregar Estudiante');
        };
    
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }
    

    let DB;
    let idEstudiante;

    const nombresInput = document.querySelector('#nombres');
    const apellidosInput = document.querySelector('#apellidos');
    const emailInput = document.querySelector('#email');
    const cuiInput = document.querySelector('#cui');
    const telefonoInput = document.querySelector('#telefono');
    const encargadoInput = document.querySelector('#encargado');

    const formulario = document.querySelector('#formulario');


    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        // Actualiza el registro
        formulario.addEventListener('submit', actualizarEstudiante);

        // Verificar Id de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idEstudiante = parametrosURL.get('id');


        if(idEstudiante){
            setTimeout(() => {
                obtenerEstudiante(idEstudiante);
            }, 100);
        }
    });

    function actualizarEstudiante(e){
        e.preventDefault();

        if(nombresInput.value === '' || apellidosInput.value  === '' || emailInput.value  === '' || cuiInput.value  === '' || telefonoInput.value  === '' || encargadoInput.value  === '' ){
            imprimirAlerta('Campos Obligatorios','error');

            return;
        }

        // Actualizar Estudiante
        const estudianteActualizado = {
            nombres: nombresInput.value,
            apellidos: apellidosInput.value,
            email: emailInput.value,
            cui: cuiInput.value,
            telefono: telefonoInput.value,
            encargado: encargadoInput.value,
            id: Number(idEstudiante)
        }

        var opcion = confirm("Actualizar Datos");
        if (opcion == false) {
            return;
        }

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        objectStore.put(estudianteActualizado);

        transaction.oncomplete = function() {
            alert('El estudiante: '+estudianteActualizado.nombres+' '+estudianteActualizado.apellidos+
            '\nEmail: '+ estudianteActualizado.email+'  Telefono: '+estudianteActualizado.telefono
            +'\nEncargado: '+estudianteActualizado.encargado+ '\n\n Fue actualizado exitosamente');

            imprimirAlerta('Redirigiendo al Menu principal en 3 segundos...');

            setTimeout(() => {
                
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = function() {
            imprimirAlerta('Error al Actualizar', 'error');
        }




    }


    function obtenerEstudiante(id){
        const transaction = DB.transaction(['crm']);
        const objectStore = transaction.objectStore('crm');

        const estudiante = objectStore.openCursor();

        estudiante.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);

                    const TituloEditar = document.querySelector('#TituloEditar');
                    TituloEditar.textContent = "Editar Estudiante: "+cursor.value.nombres+" "+cursor.value.apellidos;
                }

                cursor.continue();
            }
        }

    }

    function llenarFormulario(datosEstudiante){
        const {nombres, apellidos, email, cui, telefono, encargado} = datosEstudiante;
        
        nombresInput.value = nombres;
        apellidosInput.value = apellidos;
        emailInput.value = email;
        cuiInput.value = cui;
        telefonoInput.value = telefono;
        encargadoInput.value = encargado;

        
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.log('Error al conectarse a la base de Datos | Editar Estudiante');
        };

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }

})();