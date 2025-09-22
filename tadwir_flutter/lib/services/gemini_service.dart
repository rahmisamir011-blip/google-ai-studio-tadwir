import 'dart:io';
import 'package:google_generative_ai/google_generative_ai.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../models/app_exception.dart';

// IMPORTANT: You must provide your own API key.
// Follow the instructions in the README to set it up.
const String _apiKey = String.fromEnvironment('GEMINI_API_KEY');

class GeminiService {
  late final GenerativeModel _model;
  bool _isInitialized = false;

  GeminiService() {
    _initialize();
  }

  void _initialize() {
    if (_apiKey.isEmpty) {
      print('API key is missing. Please provide it as an environment variable.');
      _isInitialized = false;
      return;
    }
    _model = GenerativeModel(model: 'gemini-pro-vision', apiKey: _apiKey);
    _isInitialized = true;
  }

  Future<String> generateContentFromText(String query) async {
    if (!_isInitialized) {
      throw AppException('Gemini Service is not initialized. Please check your API Key.');
    }
    try {
      final response = await _model.generateContent([Content.text(query)]);
      return response.text ?? 'No response from Gemini. The item may not be recognized.';
    } catch (e) {
      print('Error generating content from text: $e');
      throw AppException('Could not get response from Gemini. Please try again.');
    }
  }

  Future<String> generateContentFromImage(File image) async {
    if (!_isInitialized) {
      throw AppException('Gemini Service is not initialized. Please check your API Key.');
    }
    try {
      final imageBytes = await image.readAsBytes();
      final prompt = TextPart("What is this item and how can I recycle it?");
      final imagePart = DataPart('image/jpeg', imageBytes);

      final response = await _model.generateContent([
        Content.multi([prompt, imagePart])
      ]);
      return response.text ?? 'No response from Gemini. The item may not be recognized.';
    } catch (e) {
      print('Error generating content from image: $e');
      throw AppException('Could not get response from Gemini. Please try again.');
    }
  }
}
