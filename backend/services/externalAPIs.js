import axios from 'axios';

// PubMed API Service
class PubMedService {
    constructor() {
        this.baseURL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
    }

    // Search publications by keywords
    async searchPublications(query, maxResults = 20) {
        try {
            // Step 1: Search for PMIDs
            const searchResponse = await axios.get(`${this.baseURL}/esearch.fcgi`, {
                params: {
                    db: 'pubmed',
                    term: query,
                    retmax: maxResults,
                    retmode: 'json'
                }
            });

            const pmids = searchResponse.data.esearchresult.idlist;
            if (!pmids || pmids.length === 0) {
                return [];
            }

            // Step 2: Fetch details for each PMID
            const detailsResponse = await axios.get(`${this.baseURL}/esummary.fcgi`, {
                params: {
                    db: 'pubmed',
                    id: pmids.join(','),
                    retmode: 'json'
                }
            });

            const publications = [];
            const results = detailsResponse.data.result;

            for (const pmid of pmids) {
                const pub = results[pmid];
                if (pub) {
                    publications.push({
                        pmid: pub.uid,
                        title: pub.title,
                        authors: pub.authors?.map(a => a.name) || [],
                        journal: pub.fulljournalname || pub.source,
                        publishedDate: pub.pubdate,
                        doi: pub.elocationid?.split(' ')[0]?.replace('doi:', ''),
                        url: `https://pubmed.ncbi.nlm.nih.gov/${pub.uid}/`
                    });
                }
            }

            return publications;
        } catch (error) {
            console.error('PubMed search error:', error.message);
            throw new Error('Failed to search PubMed');
        }
    }

    // Get publication details by PMID
    async getPublicationDetails(pmid) {
        try {
            const response = await axios.get(`${this.baseURL}/efetch.fcgi`, {
                params: {
                    db: 'pubmed',
                    id: pmid,
                    retmode: 'xml'
                }
            });

            // Parse XML response (simplified)
            return {
                pmid,
                xml: response.data
            };
        } catch (error) {
            console.error('PubMed fetch error:', error.message);
            throw new Error('Failed to fetch publication details');
        }
    }
}

// ClinicalTrials.gov API Service
class ClinicalTrialsService {
    constructor() {
        this.baseURL = 'https://clinicaltrials.gov/api/v2/studies';
    }

    // Search clinical trials
    async searchTrials(params = {}) {
        try {
            const { condition, location, status, maxResults = 20 } = params;

            const queryParams = {
                'query.cond': condition,
                'query.locn': location,
                'filter.overallStatus': status,
                pageSize: maxResults,
                format: 'json'
            };

            // Remove undefined params
            Object.keys(queryParams).forEach(key =>
                queryParams[key] === undefined && delete queryParams[key]
            );

            const response = await axios.get(this.baseURL, { params: queryParams });

            const trials = response.data.studies?.map(study => {
                const protocolSection = study.protocolSection;
                const identificationModule = protocolSection?.identificationModule;
                const statusModule = protocolSection?.statusModule;
                const descriptionModule = protocolSection?.descriptionModule;
                const eligibilityModule = protocolSection?.eligibilityModule;
                const contactsLocationsModule = protocolSection?.contactsLocationsModule;

                return {
                    nctId: identificationModule?.nctId,
                    title: identificationModule?.officialTitle || identificationModule?.briefTitle,
                    description: descriptionModule?.briefSummary,
                    phase: protocolSection?.designModule?.phases?.[0],
                    status: statusModule?.overallStatus,
                    conditions: protocolSection?.conditionsModule?.conditions || [],
                    eligibility: {
                        criteria: eligibilityModule?.eligibilityCriteria,
                        minAge: eligibilityModule?.minimumAge,
                        maxAge: eligibilityModule?.maximumAge,
                        gender: eligibilityModule?.sex
                    },
                    location: {
                        facilities: contactsLocationsModule?.locations?.map(loc =>
                            `${loc.facility}, ${loc.city}, ${loc.country}`
                        ) || []
                    },
                    contactEmail: contactsLocationsModule?.centralContacts?.[0]?.email,
                    sponsor: protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name
                };
            }) || [];

            return trials;
        } catch (error) {
            console.error('ClinicalTrials search error:', error.message);
            throw new Error('Failed to search clinical trials');
        }
    }

    // Get trial details by NCT ID
    async getTrialDetails(nctId) {
        try {
            const response = await axios.get(`${this.baseURL}/${nctId}`, {
                params: { format: 'json' }
            });

            return response.data;
        } catch (error) {
            console.error('ClinicalTrials fetch error:', error.message);
            throw new Error('Failed to fetch trial details');
        }
    }
}

export const pubMedService = new PubMedService();
export const clinicalTrialsService = new ClinicalTrialsService();
