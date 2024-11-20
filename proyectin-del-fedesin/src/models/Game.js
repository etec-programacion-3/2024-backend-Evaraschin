import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  genero: {
    type: String,
    required: true
  },
  plataforma: {
    type: [String],
    required: true
  },
  imagenUrl: String,
  clasificacionEdad: String,
  fechaLanzamiento: Date,
  desarrollador: String,
  stock: {
    type: Number,
    default: 0
  }
});

export default mongoose.model('Game', gameSchema);