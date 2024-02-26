# Pollinations Digital Twin

Pollinations Digital Twin is a WhatsApp bot leveraging OpenAI's GPT to interact with users through text and audio messages. The current example code embodies the quirky persona of Portrait XO A.I., engaging users with absurd and thought-provoking responses.

## Features

- **Text and Audio Processing**: Handles both text and audio inputs, converting audio to text for processing.
- **Dynamic Conversations**: Utilizes OpenAI's GPT model for generating responses based on a unique system prompt.
- **Audio Generation**: Integrates music generation and text-to-speech capabilities, enhancing responses with audio effects.
- **Environment Customization**: Supports environment-specific configurations through `.env` files.

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