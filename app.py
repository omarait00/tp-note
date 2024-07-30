import logging

# Configuration du logging
logging.basicConfig(filename='app.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    logging.info('Application démarrée')
    try:
        logging.info('Exécution de la tâche principale')
        # Simuler une tâche
        for i in range(5):
            logging.info(f'Itération {i}')
    except Exception as e:
        logging.error(f'Une erreur est survenue: {e}')
    finally:
        logging.info('Application terminée')

if __name__ == "__main__":
    main()
