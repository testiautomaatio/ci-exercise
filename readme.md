# CI-workflow ja REST-rajapinnan testaus

Tässä tehtävässä toteutat GitHub Actions -workflown ja kirjoitat testejä REST-rajapinnalle. Workflown tulee käynnistää testattava sovellus ja suorittaa kirjoittamasi testit sitä vasten.

Lähtötilanteessa repositoriossa ei ole valmista workflowta tai testisarjaa eikä testaustyökalua ole valittu. Sinun tulee valita sopiva työkalu, asentaa sen riippuvuudet, kirjoittaa testit ja automatisoida kokonaisuus.

Tehtävä pisteytetään vaiheittain, joten saat osapisteitä jo workflow:n luonnista ja sovelluksen käynnistämisestä, vaikka testit eivät olisi vielä valmiita. Kannattaa siis edetä vaihe kerrallaan ja kokeilla että edeltävät vaiheet toimivat ennen kuin siirryt seuraavaan.

## Tausta ja oppimistavoitteet

Aiemmissa testaustehtävissä olet ehkä voinut kokeilla sovellusta käsin esimerkiksi painikkeita klikkaamalla. Tällä kertaa testattavalla sovelluksella ei ole käyttöliittymää: se tarjoaa rajapinnan esimerkiksi toiselle kehitystiimille, joka voi myöhemmin integroida oman sovelluksensa siihen. Miten voit varmistaa, että rajapinta toimii odotetusti jo ennen kuin tuo käyttöliittymä on olemassa?

Pääset valitsemaan itse, miten lähestyt ongelmaa! Voit käyttää tuttua testaustyökalua, kokeilla uutta tai rakentaa testit vaikkapa `curl`-komennoilla ja Bash-skripteillä. Olennaista on, että testit tarkistavat tulokset ja että ne voidaan suorittaa automaattisesti GitHub Actionsissa.

Tehtävän jälkeen osaat:

- testata REST-rajapintaa lähettämällä HTTP-pyyntöjä, käyttämällä autentikointia ja tarkistamalla vastauksia ja virhetilanteita
- valita tehtävään sopivat työkalut ja asentaa niiden riippuvuudet automatisoidussa ympäristössä
- rakentaa CI-työnkulun, joka käynnistää sovelluksen ja suorittaa testit
- tulkita työnkulun tuloksia ja havaita testien tai sovelluksen käynnistyksen epäonnistumiset.

## GitHub actions -ympäristö

Workflow suoritetaan GitHub actionsissa Linux-ympäristössä. Valitsemiesi työkalujen ja kirjoittamiesi testien tulee siis toimia kyseisessä ympäristössä. Tyypillisesti samat kehitys- ja testaustyökalut toimivat eri käyttöjärjestelmissä, joten tämä ei toivottavasti aiheuta ongelmia.

Voit käyttää graafisia käyttöliittymiä ja esimerkiksi VS Code -laajennoksia testien kirjoittamiseen ja kokeilemiseen omalla koneellasi. Kaikki GitHub actionsissa tapahtuvat komennot suoritetaan kuitenkin ilman graafista käyttöliittymää, joten varmista, että valitsemasi työkalu toimii komentoriviltä ja että sen riippuvuudet voidaan asentaa automaattisesti.

Suosittelemme käyttämään kehitysympäristönä [GitHub Codespacesia](https://docs.github.com/en/codespaces/overview) tai paikallista [devcontaineria](https://code.visualstudio.com/docs/devcontainers/containers). Nämä ratkaisut muistuttavat GitHub Actionsin ympäristöä.

## Testattava sovellus

Testattava sovellus löytyy tästä repositoriosta [`app`-kansiosta](./app/README.md). Sovellus tarjoaa yksinkertaisen REST-rajapinnan treenien (workout) hallintaan. Lue sovelluksen [README:stä](./app/README.md) käynnistysohjeet, rajapinnan osoitteet ja kuvaus toiminnasta. Sovellus on tarkoitettu testattavaksi, joten se ei sisällä rekisteröitymistä eikä tietojen pysyvää tallentamista.

Sovellus käyttää tietojen tallentamiseen paikallista muistia, joten sen toiminta alkaa nollasta jokaisella käynnistyksellä. Testisi voivat muuttaa sovelluksen tilaa ja voit esimerkiksi lisätä, hakea ja poistaa niitä. Data ei kuitenkaan säily eri käynnistysten välillä.

## Sovelluksen asentaminen ja käynnistäminen

App-hakemistossa sijaitseva sovellus on toteutettu [Node.js](https://nodejs.org/):llä ja [TypeScriptillä](https://www.typescriptlang.org/) käyttäen [Hono-frameworkia](https://honojs.dev/).

Sinun ei tarvitse lukea eikä muokata sovelluksen lähdekoodia, mutta voit halutessasi tehdä niin. Oleellista on, että saat sovelluksen käynnistettyä ja voit lähettää siihen HTTP-pyyntöjä. Sovellus voidaan käynnistää joko suoraan Node.js:llä tai vaihtoehtoisesti Dockerilla.

Tarkemmat asennus- ja käyttöohjeet löytyvät [sovelluksen README:stä](./app/README.md). Lue se huolellisesti, sillä siinä on myös tietoa rajapinnan osoitteista, odotetuista vastauksista ja virhetilanteista. Sovelluksessa on myös käyttäjätunnukset ja salasanat, jotka löytyvät samasta README-tiedostosta.

## Tehtävä

Tehtävä on jaettu eri vaiheisiin, joista saa osapisteitä. Suosittelemme etenemään vaihe kerrallaan ja varmistamaan, että edeltävät vaiheet toimivat ennen kuin siirryt seuraavaan.

### 1. GitHub actions -workflow:n luonti ja autograder (20 %)

GitHubin automaattiset CI-työnkulut eli actionsit määritellään YAML-tiedostoina repositorion `.github/workflows/`-hakemistossa. Tiedostoon määritellään kaikki työnkulkuun liittyvät vaiheet ja asetukset. Tehtävässä ei ole valmiina tarvittuja hakemistoja eikä yhtään workflow:ta, joten luo hakemistot ja tiedosto itse. Workflow-tiedoston nimellä ei ole merkitystä, kunhan se noudattaa [GitHubin vaatimuksia](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax).

Aloita tutustumalla [GitHub actionsin dokumentaatioon](https://docs.github.com/en/actions). Suosittelemme tekemään ensin [quick start -dokumentin mukaisen workflown](https://docs.github.com/en/actions/get-started/quickstart) ja tarkistamaan, että saat sen toimimaan. Sen jälkeen voit muokata sitä sovelluksen käynnistämiseen ja testien suorittamiseen sopivaksi. Voit asettaa workflown käynnistymään [esimerkiksi `push`- ja `workflow_dispatch`-tapahtumista](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push). Käytä [GitHubin Linux-pohjaista runneria](https://docs.github.com/en/actions/reference/runners/github-hosted-runners), esimerkiksi `ubuntu-latest`, joka sisältää valmiiksi useita vaadittuja työkaluja.

```yaml
# sisältää Node.js:n, Dockerin ja muita työkaluja valmiina
runs-on: ubuntu-latest
```

**Automaattinen arviointi**

Kun olet saanut workflow:n ajettua onnistuneesti, lisää siihen automaattiseen arviointiin vaadittavat kohdat.

Aloita määrittelemällä tiedoston alkuun käyttöoikeudet, jotka sallivat workflow:n lukea repositorion tiedostot ja kirjoittaa tehtävästä saamasi pisteet commitin statukseen:

```diff
+ permissions:
+   contents: read
+   statuses: write
```

Lisää työnkululle myös *timeout*, joka estää työnkulkua jäämästä jumiin, jos se kestää liian kauan. Lisää myös loppuun step, joka käynnistää automaattisen arvioinnin:

```diff
  # ...

+ permissions:
+   contents: read
+   statuses: write

  # ...

  jobs:
    name_of_your_job:
      runs-on: ubuntu-latest
+     timeout-minutes: 5

      steps:
        # ... muut vaiheet, kuten checkout, sovelluksen käynnistys ja testien suoritus ...

        - uses: actions/checkout@v7

        # Lisää viimeiseksi vaiheeksi automaattinen arviointi:
+       - name: Autograding
+         if: always()
+         uses: ohjelmistokehitys/autograder@v0
```

Automaattinen arviointi käyttää https://github.com/ohjelmistokehitys/autograder -actionia, joka on tarkoitettu tehtävien arviointiin. Sinun ei tarvitse perehtyä siihen enempää, mutta voit halutessasi tutustua sen toteutukseen GitHubissa.

> [!TIP]
> GitHub actions ei automaattisesti kloonaa repositorion sisältöä, joten sinun tulee käyttää `actions/checkout`-actionia ennen kuin voit käyttää repositorion tiedostoja. Quick start -esimerkissä tämä löytyy valmiina, mutta jos kirjoitat workflow:n alusta, muista lisätä se ennen automaattista arviointia.

### 2. Testattavan sovelluksen käynnistäminen (20 %)

Testattava sovellus tulee käynnistää GitHub actionsissa, jotta testit voivat lähettää siihen HTTP-pyyntöjä. Sovellus voidaan asentaa ja käynnistää joko Node.js:llä tai Dockerilla. Molemmat löytyvät esimerkiksi GitHubin [`ubuntu-latest`-runnerilta valmiina](https://github.com/actions/runner-images#available-images), joten voit valita itsellesi sopivimman tavan. Tarkemmat ohjeet sovelluksen käynnistämiseen löytyvät [sovelluksen README:stä](./app/README.md).

**Suorittaminen taustalla**

Huomaa, että sovellus tulee käynnistää *taustalle*, jotta GitHub actions voi jatkaa seuraaviin vaiheisiin ja suorittaa testit. Docker compose käynnistää palvelut taustalle automaattisesti jos käytät `-d`- tai `--detach`-vipua. Node.js:llä voit käyttää Bashin `&`-merkkiä, joka käynnistää komennon taustalle. Etsi tarpeen mukaan lisätietoa ja kokeile ratkaisuasi komentorivillä ennen sen lisäämistä workflow:hun.

**Käynnistymisen odottaminen**

Pelkkä taustakäynnistys ei tarkoita, että sovellus olisi heti valmis vastaamaan HTTP-pyyntöihin. Palvelimelle kestääkin hetken, ennen kuin se on valmis ja testit voidaan aloittaa.

Lisää workflow:hun vaihe, joka odottaa, kunnes sovellus vastaa HTTP-pyyntöihin. Voit esimerkiksi [tarkistaa curl-komennolla toistuvasti `GET /health` -päätepistettä rajatun ajan](https://everything.curl.dev/usingcurl/downloads/retry.html), kunnes saat vastauksen. Määritä myös workflow:hun [aikaraja](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepstimeout-minutes), jotta workflow ei jää tarpeettomasti ajoon, jos sovellus ei vastaa esimerkiksi yhden minuutin kuluessa.

### 3. Valitse testaustyökalu

Varsinaisten testien suunnittelun ja suorittamisen osalta voit valita itse sopivan tavan ja työkalun. Testien tulee kuitenkin olla automatisoitavissa komentoriviltä, jotta voit automatisoida ne GitHub actionsissa. Testaustyökalun valinnassa kannattaa miettiä omia mieltymyksiä ja oppimistavoitteita sekä eri testaustyökalujen ominaisuuksia.

Voit hyödyntää työkalun valinnassa tässä repositoriossa löytyvää [tools.md-tiedostoa](./tools.md), jossa on listattu joitain vaihtoehtoisia lähestymistapoja sekä avoimen lähdekoodin työkaluja, joita voit käyttää. Tiedosto sisältää myös linkkejä työkalujen dokumentaatioihin ja ohjeisiin.

### 4. Testien toteuttaminen ja suorittaminen: perustapaukset (10 * 3 %)

Kirjoita testit, jotka tarkistavat sovelluksen rajapinnan toimintaa eri tilanteissa. Testien tulee tarkistaa HTTP-tilakoodit ja tarvittaessa myös vastauksen sisältö. Testit tulee pystyä suorittamaan GitHub actionsissa.

Lisää GitHub actions -workflow:hun vaihe, joka asentaa testiesi riippuvuudet ja suorittaa testit. Varmista, että olet myös lisännyt kaikki testaukseen tarvittavat tiedostot ja asetukset repositorioon, jotta testit voidaan suorittaa GitHub actionsissa.

Suosittelemme, että testaat esimerkiksi ensin palvelimen juuressa olevan päätepisteen `GET /` ja `GET /health`, jotka eivät vaadi autentikointia. Näistä saat jo osan pisteistä. Voit myös testata autentikointia vaativat päätepisteet ilman autentikointia, jolloin saat testattua, että palvelin palauttaa `401 Unauthorized` -tilakoodeja.

Kun saat nämä testit toimimaan GitHub actionsissa, kannattaa siirtyä testaamaan autentikointia vaativia päätepisteitä. Toteuta testin alussa kirjautuminen, ja käytä saamaasi tokenia seuraavissa kutsuissa. Autentikointia ja tokenia koskevat ohjeet löytyvät [sovelluksen README:stä](./app/README.md).

#### HTTP-metodit

Tehtävässä tarvitset seuraavia HTTP-metodeja. Voit lukea lisää HTTP-metodeista esimerkiksi [MDN:n dokumentaatiosta](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods).

| Metodi | Käyttötarkoitus tässä tehtävässä |
| --- | --- |
| `GET` | Hae tietoja, kuten harjoituksia tai health-checkin tulos. |
| `POST` | Kirjaudu sisään tai luo uusi harjoitus. |
| `PUT` | Päivitä harjoituksen tiedot. Pyyntö korvaa harjoituksen muokattavat tiedot. |
| `DELETE` | Poista harjoitus. |

#### HTTP-vastausten tilakoodit

HTTP-palvelimen vastatessa pyyntöön se palauttaa HTTP-tilakoodin, joka kertoo, onnistuiko pyyntö vai ei. Eri sarjat kertovat, onko pyyntö onnistunut, epäonnistunut vai onko palvelimella ongelmia. Esimerkiksi 2xx-tilakoodit kertovat, että pyyntö onnistui. 3xx-tilakoodit kertovat, että pyyntö onnistui, mutta vaatii lisätoimia, esimerkiksi uudelleenohjauksen. 4xx-tilakoodit kertovat, että pyyntö ei onnistunut, koska asiakas teki virheen. 5xx-tilakoodit kertovat, että palvelimella on tapahtunut virhe.

Tässä tehtävässä tarvitset lähinnä 2xx- ja 4xx-tilakoodeja, jotka on koostettu alla olevaan taulukkoon. Voit lukea lisää HTTP-tilakoodeista esimerkiksi [MDN:n dokumentaatiosta](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

| Tilakoodi | Merkitys tässä tehtävässä |
| --- | --- |
| `200 OK` | Pyyntö onnistui, esimerkiksi tietojen haussa, kirjautumisessa tai päivityksessä. |
| `201 Created` | Harjoituksen luonti onnistui. |
| `204 No Content` | Harjoituksen poisto onnistui, eikä vastauksessa ole sisältöä. |
| `400 Bad Request` | Pyynnön JSON tai kenttien arvot ovat virheelliset. |
| `401 Unauthorized` | Kirjautuminen epäonnistui tai suojattuun päätepisteeseen ei toimitettu kelvollista tokenia. |
| `404 Not Found` | Harjoitusta ei löydy tai se kuuluu toiselle käyttäjälle. |

Hyödynnä edellä käsiteltyjä HTTP-metodeja ja -tilakoodeja testien kirjoittamisessa. Alla on esitetty taulukko, joka sisältää testattavat päätepisteet ja tilanteet.

| Päätepiste | Testattavat tilanteet |
| --- | --- |
| `GET /` | Tervetuloviesti JSON-muodossa ja `200`. |
| `GET /health` | Ilman kirjautumista palautuu `200` ja vastaus kertoo kyseessä olevan esimerkinomainen tarkistus. |
| `POST /auth/login` | Oikeilla tunnuksilla palautuu token; väärillä tunnuksilla `401`. Virheellinen JSON-syntaksi tai virheelliset kentät palauttavat `400`. |
| `GET /workouts` | Kirjautuneena palautuu lista harjoituksista. Varmista, että luotu workout näkyy siinä ja poistettu ei enää näy. Kukin käyttäjä voi nähdä vain omat harjoituksensa. |
| `POST /workouts` | Kelvollisilla tiedoilla palautuu `201`, luotu workout ja sen saama uusi ID. Virheelliset syötteet palauttavat `400`. |
| `GET /workouts/:id` | Luotu workout löytyy ID:llä ja sen tiedot ovat oikein. Tuntematon ID palauttaa `404`. Jos workout kuuluu toiseen käyttäjään, palauttaa `404`. |
| `PUT /workouts/:id` | Kelvollinen päivitys palauttaa `200`. Virheelliset syötteet palauttavat `400`, tuntematon ID tai eri käyttäjän datan muokkausyritys palauttavat `404`. |
| `DELETE /workouts/:id` | Luodun workoutin poisto palauttaa `204` ja tyhjän vastauksen. Tuntematon ID tai eri käyttäjän datan poistoyritys palauttaa `404`. |

### 5. Testien toteuttaminen ja suorittaminen: negatiiviset testitapaukset (10 * 3 %)

Onnistuneiden pyyntöjen lisäksi testien tulee tarkistaa myös virhetilanteita. Testaa esimerkiksi, että puuttuvat tai väärän tyyppiset kentät eivät aiheuta odottamattomia virheitä. Varmista, etteivät epäonnistuneet päivitykset muuta tallennettuja tietoja.

Tarkista lisäksi, että autentikointia vaativat päätepisteet palauttavat `401 Unauthorized`, jos pyyntö lähetetään esimerkiksi ilman vaadittua autentikointitokenia.

Käytä testeissäsi [molempia käyttäjätunnuksia](./app/README.md), jotta voit varmistaa, että käyttäjät eivät voi nähdä, muokata tai poistaa toistensa tietoja. Voit luoda molemmille käyttäjille kirjautumistokenit ja testata, että toisella tokenilla luotu data ei ole toisen käyttäjän luettavissa, muokattavissa tai poistettavissa.

## Tehtävän lähettäminen ja arviointi

Lähetä ratkaisusi GitHubiin ja varmista, että workflow suoritetaan onnistuneesti. Tarkista, että testien suorittaminen onnistuu ja tutki automaattisen arvioinnin tulokset.

On hyvin mahdollista, että testisi menevät läpi ja että et saa aivan kaikkia pisteitä. Tässä tilanteessa kannattaa tarkistaa autograding-raportista ne testitapaukset, joista pisteitä ei tullut, ja tutkia onko niissä tilanteita, joita et ole huomioinut testeissäsi.

Voit lähettää ratkaisusi GitHubiin useita kertoja tehtävän määräaikaan asti. Varmista kuitenkin, että viimeisin suoritus tuottaa parhaan tuloksen.

## Materiaalista

Tämän tehtävän on kehittänyt Teemu Havulinna ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Tehtävän luonnissa on hyödynnetty kielimalleja ja tekoälytyökaluja, kuten GitHub Copilot.
