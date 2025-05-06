import requests
from bs4 import BeautifulSoup
import pandas as pd
from datetime import date

GOOGLE_SEARCH_URL = 'https://www.google.com/search?num=20&q='

def clean_url(url):
    """
    Cleans and extracts a valid URL from a Google search result.

    Args:
        url (str): The raw URL string from Google search results.

    Returns:
        str or None: The cleaned URL, or None if no valid URL is found.
    """
    start = url.find('https://')
    if start == -1:
        return None
    end = url.find('&ved', start)
    return url[start:end] if end != -1 else url[start:]


def fetch_search_results(keyword):
    """
    Fetches Google search results for a given keyword.

    Args:
        keyword (str): The search query keyword.

    Returns:
        BeautifulSoup: Parsed HTML content of the search results.

    Raises:
        Exception: If the request fails or if rate limits are hit.
    """
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'}
    response = requests.get(f"{GOOGLE_SEARCH_URL}{keyword}", headers=headers)
    if response.status_code == 200:
        return BeautifulSoup(response.text, 'html.parser')
    elif response.status_code == 429:
        raise Exception("Rate limit hit, status code 429. Blocked from Google.")
    else:
        raise Exception(f"Failed to retrieve data, status code: {response.status_code}")


def extract_urls_from_soup(soup):
    """
    Extracts URLs from the Google search results page.

    Args:
        soup (BeautifulSoup): Parsed HTML content of the search results.

    Returns:
        list: A list of cleaned URLs extracted from the search results.
    """
    urls = []
    for div in soup.find_all('div', class_="yuRUbf"):
        link = div.find('a')
        if link:
            clean = clean_url(link.get('href', ""))
            if clean:
                urls.append(clean)
    return urls


def rank_check(sitename, serp_df, keyword, rank_type):
    """
    Checks the rank of a given site or competitors in the search results.

    Args:
        sitename (str): The site or competitor's domain to check.
        serp_df (DataFrame): DataFrame containing URLs from search results.
        keyword (str): The search keyword used for ranking.
        rank_type (str): Type of rank ("My Site" or "Competitor").

    Returns:
        DataFrame: A DataFrame with ranking information.
    """
    results = []
    for idx, url in enumerate(serp_df['URLs'], start=1):
        if sitename in url:
            results.append({
                'Keyword': keyword,
                'Rank': idx,
                'URLs': url,
                'Date': date.today().strftime("%d-%m-%Y"),
                'Type': rank_type
            })
    return pd.DataFrame(results)


def get_rankings(keyword, sitename, competitors):
    """
    Retrieves and aggregates rankings for a site and its competitors.

    Args:
        keyword (str): The search keyword.
        sitename (str): The site's domain to check rankings for.
        competitors (list): List of competitor domains to check rankings for.

    Returns:
        DataFrame: A sorted DataFrame with rankings for the site and competitors.

    Raises:
        Exception: If no URLs are found in the search results or other errors occur.
    """
    try:
        soup = fetch_search_results(keyword)
        urls = extract_urls_from_soup(soup)
        if not urls:
            raise Exception("No URLs found in the search results.")

        serp_df = pd.DataFrame(urls, columns=['URLs'])

        main_site_ranking = rank_check(sitename, serp_df, keyword, "My Site")

        competitor_rankings = pd.concat(
            [rank_check(comp, serp_df, keyword, "Competitor") for comp in competitors],
            ignore_index=True
        )

        all_rankings = pd.concat([main_site_ranking, competitor_rankings], ignore_index=True)
        return all_rankings.sort_values(by='Rank')

    except Exception as e:
        return pd.DataFrame({'status': [str(e)]})


def trends_result(data):
    """
    Processes the input data to retrieve search rankings and return a response.

    Args:
        data (TrendsRequest): Input data containing keyword, sitename, and competitors.

    Returns:
        dict: A dictionary with "status" and either "data" (on success) or "message" (on failure).
    """
    keyword = data.keyword
    sitename = data.sitename
    competitors = data.competitors
    rankings_df = get_rankings(keyword, sitename, competitors)

    if len(rankings_df) <= 1:
        return {
            "status": "failed",
            "message": "No rankings found. Please check your input and try again."
        }

    rankings_list = rankings_df.to_dict(orient='records')
    return {
        "status": "success",
        "data": rankings_list
    }
