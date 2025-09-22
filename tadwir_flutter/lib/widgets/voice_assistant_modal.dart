import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart';
import '../services/gemini_service.dart';
import './voice_result_modal.dart';

class VoiceAssistantModal extends StatefulWidget {
  const VoiceAssistantModal({Key? key}) : super(key: key);

  @override
  _VoiceAssistantModalState createState() => _VoiceAssistantModalState();
}

class _VoiceAssistantModalState extends State<VoiceAssistantModal> {
  final SpeechToText _speechToText = SpeechToText();
  final GeminiService _geminiService = GeminiService();
  bool _speechEnabled = false;
  String _lastWords = '';
  bool _isListening = false;

  @override
  void initState() {
    super.initState();
    _initSpeech();
  }

  void _initSpeech() async {
    _speechEnabled = await _speechToText.initialize();
    setState(() {});
  }

  void _startListening() async {
    await _speechToText.listen(onResult: _onSpeechResult);
    setState(() {
      _isListening = true;
    });
  }

  void _stopListening() async {
    await _speechToText.stop();
    setState(() {
      _isListening = false;
    });
    // After stopping, process the result
    if (_lastWords.isNotEmpty) {
      _processVoiceCommand(_lastWords);
    }
  }

  void _onSpeechResult(result) {
    setState(() {
      _lastWords = result.recognizedWords;
    });
  }

  void _processVoiceCommand(String command) async {
    // Close the voice assistant modal
    Navigator.of(context).pop();

    // Show a loading dialog while we get the result
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(child: CircularProgressIndicator()),
    );

    final result = await _geminiService.generateContentFromText(command);

    // Close the loading dialog
    Navigator.of(context).pop();

    // Show the final result
    showVoiceResultModal(context, result);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      height: 300,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            _isListening ? _lastWords : 'Tap the mic to start speaking',
            style: Theme.of(context).textTheme.headlineSmall,
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 20),
          IconButton(
            icon: Icon(_isListening ? Icons.mic : Icons.mic_none),
            iconSize: 60,
            color: Theme.of(context).primaryColor,
            onPressed: _isListening ? _stopListening : _startListening,
          ),
          const SizedBox(height: 20),
          if (!_isListening)
            Text(
              'e.g., "how to recycle batteries?"',
              style: Theme.of(context).textTheme.bodySmall,
            ),
        ],
      ),
    );
  }
}

// Helper function to show the modal
void showVoiceAssistantModal(BuildContext context) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    builder: (context) => const VoiceAssistantModal(),
  );
}
