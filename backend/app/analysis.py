import requests
from bs4 import BeautifulSoup
from collections import defaultdict
import re
from nlp_id.postag import PosTag
import nltk

nltk.download('punkt_tab')

postagger = PosTag()


def ensure_url_scheme(url):
    """
    Ensures the URL has a scheme (http or https).

    Args:
        url (str): A URL string, potentially missing a scheme.

    Returns:
        str: The URL with an ensured scheme (http or https).
    """
    if not url.startswith(('http://', 'https://')):
        return 'https://' + url
    return url


def analysis_result(sitename):
    """
    Analyze a webpage for specific categories of phrases using NLP.

    Args:
        sitename (str): The URL of the website to analyze.

    Returns:
        dict: A JSON-serializable dictionary containing the analysis results or an error message.
    """
    url = ensure_url_scheme(sitename)
    valid_categories = {"FW", "NN", "NP", "NNP", "DP"}
    category_labels = {
        "FW": "Foreign Word",
        "NN": "Noun",
        "NP": "Noun Phrase",
        "NNP": "Proper Noun",
        "DP": "Data Phrase",
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Referer": url,
    }

    try:
        # Fetch and parse the webpage
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract keywords and analyze content
        keywords_list = extract_keywords(soup, url)
        body_text = soup.body.get_text(separator=" ", strip=True)
        tagged_phrases = postagger.get_phrase_tag(body_text)

        # Count phrases and generate results
        category_count = count_phrases(tagged_phrases, valid_categories)
        result_json = generate_results(category_count, keywords_list, category_labels)
        if len(result_json) == 0:
            return {
                "status": "failed",
                "message": "No result found. Please check your input and try again."
            }

        return {
            "status": "success",
            "data": result_json,
        }
    except requests.RequestException as e:
        return {
            "status": "failed",
            "message": str(e),
        }


def extract_keywords(soup, sitename):
    """
    Extracts keywords from the meta tags or the URL's route.

    Args:
        soup (BeautifulSoup): Parsed HTML content of the webpage.
        sitename (str): The URL of the webpage.

    Returns:
        list: A list of keywords or route-based keywords.
    """
    meta_keywords = soup.find("meta", attrs={"name": "keywords"})
    if meta_keywords:
        return [keyword.strip() for keyword in meta_keywords.get("content", "").split(",")]
    match = re.search(r"/([^/]+)$", sitename)
    return [match.group(1).replace("-", " ")] if match else []


def count_phrases(tagged_phrases, valid_categories):
    """
    Counts occurrences of phrases by category.

    Args:
        tagged_phrases (list): A list of tuples containing phrases and their categories.
        valid_categories (set): A set of valid categories to include.

    Returns:
        defaultdict: A dictionary mapping categories to their phrase counts.
    """
    category_count = defaultdict(lambda: defaultdict(int))
    for phrase, category in tagged_phrases:
        if category in valid_categories:
            category_count[category][phrase] += 1
    return category_count


def generate_results(category_count, keywords_list, category_labels):
    """
    Generates JSON-serializable results for matching keywords and filtered phrases.

    Args:
        category_count (defaultdict): Phrase counts categorized by type.
        keywords_list (list): List of keywords to match with phrases.
        category_labels (dict): Mapping of category codes to human-readable labels.

    Returns:
        list: A list of dictionaries representing categorized phrases and their counts.
    """
    result_json = []

    # Matching results for "NP" category
    if "NP" in category_count:
        matched_phrases = {
            phrase: count
            for phrase, count in category_count["NP"].items()
            if any(kw.lower() in phrase.lower() for kw in keywords_list)
        }
        if matched_phrases:
            result_json.append({
                "category": category_labels["NP"],
                "phrases": [{"phrase": phrase, "count": count} for phrase, count in matched_phrases.items()],
            })

    # Add other categories with filter count > 5
    for category, phrases in category_count.items():
        if category != "NP":
            filtered_phrases = {phrase: count for phrase, count in phrases.items() if count > 5}
            if filtered_phrases:
                result_json.append({
                    "category": category_labels.get(category, "Unknown Category"),
                    "phrases": [{"phrase": phrase, "count": count} for phrase, count in filtered_phrases.items()],
                })

    return result_json
