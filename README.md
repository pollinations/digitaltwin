# Pollinations Digital Twin

Pollinations Digital Twin is a WhatsApp bot powered by OpenAI's cutting-edge GPT-4 Turbo Preview model, designed to engage users in conversations through text and audio messages. Drawing inspiration from the unique character of Portrait XO A.I., this bot offers whimsical and thought-provoking interactions, ensuring each conversation is distinct and memorable.

## Features

- **Text and Audio Processing**: Skillfully manages both text and audio inputs, effortlessly transforming audio messages into text for advanced processing.
- **Dynamic Conversations**: Utilizes the sophisticated capabilities of the GPT-4 Turbo Preview model to craft responses that are customized for each user's input, fostering dynamic and captivating conversations.
- **Audio Generation**: Boasts integrated capabilities for music creation and text-to-speech, enhancing user interactions with engaging audio effects.
- **Environment and Persona Customization**: Enables precise, environment-specific settings through `.env` files, with improved security by excluding `.env*` files from version control. Additionally, it supports persona customization, allowing the bot to adopt various personalities as defined in `src/persona.js`, offering a more tailored and versatile user experience.

## Setup

1. **Clone the Repository**

```bash
git clone https://github.com/your-repository/pollinations-digitaltwin.git
```


2. **Install Dependencies**

   Navigate to the project directory and install the required npm packages:

```bash
npm install
```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory and populate it with the necessary API keys and configurations as shown in `config.env`.

4. **Start the Application**

   Run the application using the npm start script defined in `package.json`:

```bash
npm start
```


## Usage

After starting the application, it listens for incoming WhatsApp messages. Users can interact with the bot by sending text or audio messages to the configured WhatsApp number. The bot processes these inputs and responds with text and optionally generated audio content.

## Development

- **Adding New Features**: Extend the bot's capabilities by modifying `index.js` and the modules in the `lib` directory.
- **Customizing Responses**: Adjust the system prompt in the `.env` file to change the bot's personality and response style.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests with your proposed changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
