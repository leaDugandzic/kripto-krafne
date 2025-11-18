from flask import Flask, request, jsonify
# from flask_cors import CORS
from datetime import datetime
import requests
import sqlite3
import logging
import os
app = Flask(__name__)
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


class KriptoKrafneChatbot:
    def __init__(self, ollama_base_url: str = "http://localhost:11434"):
        self.ollama_url = ollama_base_url
        self.model_name = "mistral"
        self.system_prompt = self._create_system_prompt()
        self.conversation_history = []
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
        
        self._init_database()
    
    def _create_system_prompt(self) -> str:
        return """Ti si AI asistent za KriptoKrafne edukativnu platformu posvećenu kibernetičkoj sigurnosti.

OSNOVNE INFORMACIJE:
- KriptoKrafne je web platforma za učenje o kibernetičkoj sigurnosti
- Sadrži interaktivne materijale, tutorijale i CTF (Capture The Flag) izazove
- Cilj je omogućiti korisnicima razumijevanje stvarnih napada, obrane i sigurnosnih koncepata

CTF KATEGORIJE:
1. Kriptografija - šifriranje, dešifriranje, Caesar, Vigenère, XOR, Base64, AES
2. Forenzika - analiza datoteka, ekstrakcija skrivenih podataka, metapodaci
3. Web sigurnost - SQL injection, XSS, CSRF, SSRF, logičke ranjivosti
4. Mrežna sigurnost - analiza mrežnog prometa, PCAP, HTTP, TCP, UDP, DNS
5. Reverzno inženjerstvo - analiza binarnih datoteka, assembly, disassembleri
6. Socijalni inženjering - manipulacija, phishing, prepoznavanje lažnih poruka

PRAVILA I SMJERNICE:
- Objašnjavaj jasno i razumljivo, prilagođeno razini korisnika
- NE daj izravna rješenja za CTF izazove - daj hintove i smjernice
- Fokusiraj se na edukaciju i etičko hakiranje
- Nikada ne daj upute za ilegalne aktivnosti
- Potiči sigurnu primjenu znanja
- Za početnike koristi jednostavnije primjere
- Za napredne korisnike možeš ići dublje u tehničke detalje

TON:
- Prijateljski, strpljiv i ohrabrujući
- Profesionalan u tehničkim objašnjenjima
- Naglašavaj važnost etičkog ponašanja

Ako korisnik traži izravno rješenje CTF izazova, objasni zašto je bolje da sam dođe do rješenja kroz učenje."""
    
    def _init_database(self):
        self.conn = sqlite3.connect('kriptokrafne_chat.db', check_same_thread=False)
        cursor = self.conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_message TEXT NOT NULL,
                bot_response TEXT NOT NULL,
                category TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        self.conn.commit()
    
    def _classify_query_category(self, user_message: str) -> str:
        message_lower = user_message.lower()
        
        categories = {
            'kriptografija': ['kriptografija', 'šifriranje', 'dešifriranje', 'caesar', 'vigenère', 'xor', 'base64', 'aes', 'šifra', 'kripto'],
            'forenzika': ['forenzika', 'datoteka', 'meta', 'hex', 'binarni', 'wav', 'png', 'jpg', 'pdf', 'ekstrakcija'],
            'web_sigurnost': ['web', 'sql', 'injection', 'xss', 'csrf', 'ssrf', 'ranjivost', 'aplikacija', 'website'],
            'mreža_sigurnost': ['mreža', 'pcap', 'http', 'tcp', 'udp', 'dns', 'promet', 'paket', 'sniffing'],
            'reverzno_inženjerstvo': ['reverzno', 'binarni', 'assembly', 'disassembler', 'dekompajler', 'reverse'],
            'socijalni_inženjering': ['socijalni', 'phishing', 'manipulacija', 'psiho', 'email', 'lažni', 'prevar']
        }
        
        for category, keywords in categories.items():
            if any(keyword in message_lower for keyword in keywords):
                return category
        
        return 'općenito'
    
    def _call_ollama_api(self, user_message: str) -> str:
        try:
            # Prvo provjeri je li Ollama pokrenut
            try:
                health_check = requests.get(f"{self.ollama_url}/api/tags", timeout=5)
                if health_check.status_code != 200:
                    return "Ollama nije pokrenut. Pokreni ga sa: ollama serve"
            except:
                return "Ollama nije pokrenut. Pokreni ga sa: ollama serve"

            messages = [{"role": "system", "content": self.system_prompt}]
            
            recent_history = self.conversation_history[-4:] if len(self.conversation_history) > 4 else self.conversation_history
            for msg in recent_history:
                messages.append(msg)
            
            messages.append({"role": "user", "content": user_message})
            
            payload = {
                "model": self.model_name,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9
                }
            }
            
            print(f"Šaljem zahtjev Ollami: {payload}")  # DEBUG
            
            response = requests.post(
                f"{self.ollama_url}/api/chat",
                json=payload,
                timeout=30
            )
            
            print(f"Ollama odgovor status: {response.status_code}")  # DEBUG
            
            if response.status_code == 200:
                result = response.json()
                return result['message']['content']
            else:
                self.logger.error(f"Ollama API error: {response.status_code} - {response.text}")
                return "Žao mi je, Ollama je vratio grešku. Pokušajte ponovno kasnije."
                
        except requests.exceptions.RequestException as e:
            self.logger.error(f"Request error: {e}")
            return "Nemoguće spojiti se na AI model. Provjerite je li Ollama pokrenut."
        except Exception as e:
            self.logger.error(f"Unexpected error: {e}")
            return "Došlo je do neočekivane pogreške. Pokušajte ponovno."
    
    def _save_conversation(self, user_message: str, bot_response: str, category: str):
        try:
            cursor = self.conn.cursor()
            cursor.execute(
                "INSERT INTO conversations (user_message, bot_response, category) VALUES (?, ?, ?)",
                (user_message, bot_response, category)
            )
            self.conn.commit()
        except Exception as e:
            self.logger.error(f"Error saving conversation: {e}")
    
    def get_response(self, user_message: str) -> str:
        if not user_message.strip():
            return "Molim unesite pitanje o kibernetičkoj sigurnosti."
        
        try:
            category = self._classify_query_category(user_message)
            bot_response = self._call_ollama_api(user_message)
            
            
            # Ako Ollama vraća grešku, koristi fallback
            # if any(keyword in bot_response.lower() for keyword in ['poteškoća', 'nemoguće', 'greška', 'error']):
            #     bot_response = self._get_fallback_response(user_message, category)
            
            # Spremi u povijest
            # self.conversation_history.append({"role": "user", "content": user_message})
            # self.conversation_history.append({"role": "assistant", "content": bot_response})
            
            # self._save_conversation(user_message, bot_response, category)
            
            return bot_response
            
        except Exception as e:
            print(f"Error in get_response: {e}")
            return "Došlo je do greške u obradi zahtjeva. Pokušajte ponovno."
        
    def _get_fallback_response(self, user_message: str, category: str) -> str:
            fallback_responses = {
                'kriptografija': "Kriptografija se bavi zaštitom informacija kroz šifriranje. U CTF izazovima često ćete susresti klasične šifre poput Caesarove ili moderne algoritme poput AES-a. Ključno pitanje: Kako se podaci transformiraju iz čitljivog u nečitljiv oblik?",
                'forenzika': "Digitalna forenzika analizira digitalne dokaze. Provjerite metapodatke datoteka, koristite hex editore i tražite skrivene podatke. Često se informacije skrivaju u neprimjetnim dijelovima datoteka.",
                'web_sigurnost': "Web sigurnost se fokusira na ranjivosti u aplikacijama. Uvijek validirajte korisnički unos i koristite parametrizirane upite za sprječavanje SQL injection napada. Nikada ne vjerujte korisničkom unosu!",
                'mreža_sigurnost': "Mrežna analiza uključuje pregledavanje PCAP datoteka. Tražite neobičan promet, nepoznate protokole ili skrivene poruke u mrežnim paketima. Wireshark je izvrstan alat za početak.",
                'reverzno_inženjerstvo': "Reverzno inženjerstvo podrazumijeva analizu programa bez izvornog koda. Koristite alate poput Ghidra, IDA Pro ili Radare2. Fokusirajte se na razumijevanje logičkih tokova i funkcija programa.",
                'socijalni_inženjering': "Socijalni inženjering koristi psihološke taktike. Obratite pažnju na znakove poput hitnosti, straha ili previše lijepih ponuda. Uvijek verificirajte identitet pošiljatelja.",
                'općenito': "KriptoKrafne vam nudi praktično iskustvo učenja kibernetičke sigurnosti kroz CTF izazove. Preporučam da počnete s kategorijom koja vas najviše zanima i postepeno širite znanje. Sjećam se: fokus je na edukaciji i etičkom ponašanju!"
            }
            
            return fallback_responses.get(category, fallback_responses['općenito'])

# Kreiraj instancu chatbot-a

chatbot = KriptoKrafneChatbot()

@app.route('/')
def index():
    return jsonify({
        "message": "KriptoKrafne Chatbot API je pokrenut!",
        "endpoints": {
            "chat": "POST /api/chat",
        }
    })
@app.route('/api/chat', methods=['GET'])
def chat_info():
    return jsonify({
        "message": "KriptoKrafne Chat API",
        "usage": "Pošalji POST zahtjev s JSON-om: {'message': 'tvoja poruka'}",
        "example": {
            "curl": "curl -X POST http://localhost:5000/api/chat -H 'Content-Type: application/json' -d '{\"message\": \"Što je kriptografija?\"}'"
        }
    })
@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat_api():
    if request.method == 'OPTIONS':
        return '', 200
        
    try:
        # Eksplicitno zahtijevaj JSON
        if not request.is_json:
            return jsonify({'error': 'Content-Type must be application/json'}), 400
            
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Nema JSON podataka'}), 400
            
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'Prazna poruka'}), 400
        
        bot_response = chatbot.get_response(user_message)
        
        # Vrati CLEAN JSON response
        return jsonify({
            'response': bot_response,
            'timestamp': datetime.now().isoformat(),
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error in chat_api: {str(e)}")
        return jsonify({
            'error': f'Server error: {str(e)}',
            'status': 'error'
        }), 500



if __name__ == '__main__':
    print("Pokrećem KriptoKrafne Chatbot server...")
    print("Provjeri: http://localhost:5000")
    print("API endpoints:")
    print("  POST /api/chat - Pošalji poruku")
    print("  GET  /api/history - Dohvati povijest")
    print("  POST /api/clear - Očisti povijest")
    app.run(debug=True, host='0.0.0.0', port=5000)