

class UsuariosSala {
    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre) {
        let Persona = {
            id,
            nombre
        }

        this.personas.push(Persona);

        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(person => {
            return person.id === id;
        })[0];
        return persona;
    }
    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {

    }
    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);
        this.personas = this.personas.filter(person => {
            return person.id != id
        });
        return personaBorrada;
    }

}

module.exports = {
    UsuariosSala
}