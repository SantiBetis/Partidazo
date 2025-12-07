const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Partidazo API',
      version: '1.0.0',
      description: 'API para la aplicación Partidazo - Plataforma de actividades deportivas',
      contact: {
        name: 'Partidazo Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del usuario',
            },
            email: {
              type: 'string',
              description: 'Email del usuario',
            },
            nombre: {
              type: 'string',
              description: 'Nombre del usuario',
            },
            apellido: {
              type: 'string',
              description: 'Apellido del usuario',
            },
            following: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Lista de IDs de usuarios seguidos',
            },
            followers: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Lista de IDs de seguidores',
            },
            activitiesPosted: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Actividades publicadas por el usuario',
            },
            activitiesJoined: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Actividades a las que se ha unido',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'ID único del post',
            },
            creator_id: {
              type: 'string',
              description: 'ID del creador del post',
            },
            titulo: {
              type: 'string',
              description: 'Título de la actividad',
            },
            deporte: {
              type: 'string',
              description: 'Tipo de deporte',
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la actividad',
            },
            fecha: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha y hora de la actividad',
            },
            ubicacion: {
              type: 'object',
              properties: {
                lat: {
                  type: 'number',
                  description: 'Latitud',
                },
                lng: {
                  type: 'number',
                  description: 'Longitud',
                },
                direccion: {
                  type: 'string',
                  description: 'Dirección completa',
                },
              },
            },
            participando: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Lista de participantes',
            },
            maxParticipantes: {
              type: 'number',
              description: 'Número máximo de participantes',
            },
            messages: {
              type: 'array',
              items: {
                type: 'object',
              },
              description: 'Mensajes del chat de la actividad',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'number',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./server.js', './handlers/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
