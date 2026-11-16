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

Workflow:n tulee toimia GitHub Actionsin Linux-runnerilla. Työkalujen ja testien tulee siis toimia komentoriviltä Linux-ympäristössä. Tyypillisesti tämä ei ole ongelma, sillä samat kehitys- ja testaustyökalut toimivat usein eri käyttöjärjestelmissä.

Voit käyttää graafisia käyttöliittymiä ja esimerkiksi VS Code -laajennoksia testien kirjoittamiseen ja kokeilemiseen omalla koneellasi. Kaikki GitHub actionsissa tapahtuvat komennot suoritetaan kuitenkin ilman graafista käyttöliittymää, joten varmista, että valitsemasi työkalu toimii komentoriviltä ja että sen riippuvuudet voidaan asentaa automaattisesti.

Suosittelemme käyttämään kehitysympäristönä [GitHub Codespacesia](https://docs.github.com/en/codespaces/overview) tai paikallista [devcontaineria](https://code.visualstudio.com/docs/devcontainers/containers).

Linux-pohjainen kehityskontti muistuttaa GitHub Actionsin Linux-runneria ja helpottaa riippuvuuksien asentamista eristettyyn ympäristöön.

## Testattava sovellus

Testattava sovellus löytyy tästä repositoriosta [`app`-kansiossa](./app/README.md). Se tarjoaa yksinkertaisen REST-rajapinnan treenien (workout) hallintaan. Lue sovelluksen README:stä käynnistysohjeet, rajapinnan osoitteet ja odotettu toiminta.

Sovellus käyttää tietojen tallentamiseen paikallista muistia, joten sen toiminta alkaa nollasta jokaisella käynnistyksellä. Testit voivat muuttaa sovelluksen tilaa ja voit esimerkiksi lisätä, hakea ja poistaa niitä. Treenit eivät kuitenkaan säily eri käynnistysten välillä.

## Sovelluksen asentaminen ja käynnistäminen

App-hakemistossa sijaitseva testattava sovellus on toteutettu Node.js:llä ja TypeScriptillä käyttäen Hono-frameworkia.

Sinun ei tarvitse tutustua eikä muokata sovelluksen lähdekoodia, mutta voit halutessasi tehdä niin. Oleellista on, että saat sovelluksen käynnistettyä ja voit lähettää siihen HTTP-pyyntöjä. Sovellus voidaan käynnistää joko suoraan Node.js:llä tai Dockerilla. Valintasi mukaan siis asenna joko Node.js tai Docker.

Tarkemmat asennus- ja käyttöohjeet löytyvät [sovelluksen README:stä](./app/README.md). Lue se huolellisesti, sillä siinä on myös tietoa rajapinnan osoitteista, odotetuista vastauksista ja virhetilanteista. Sovelluksessa on myös käyttäjätunnukset ja salasanat, jotka löytyvät readme-tiedostosta.

## Tehtävä

Tehtävä on jaettu eri vaiheisiin, joista saa osapisteitä. Suosittelemme etenemään vaihe kerrallaan ja varmistamaan, että edeltävät vaiheet toimivat ennen kuin siirryt seuraavaan.

### 1. GitHub actions -workflow:n luonti ja autograder (20 %)

GitHubin automaattiset CI-työnkulut eli actionsit määritellään YAML-tiedostoina repositorion `.github/workflows/`-hakemistossa. Tiedostoon määritellään kaikki työnkulkuun liittyvät vaiheet ja asetukset. Tehtävässä ei ole valmiina tarvittuja hakemistoja eikä yhtään workflow:ta, joten luo hakemistot ja tiedosto itse. Workflow-tiedoston nimellä ei ole merkitystä, kunhan se noudattaa [GitHubin vaatimuksia](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax).

Aloita tutustumalla [GitHub actionsin dokumentaatioon](https://docs.github.com/en/actions). Suosittelemme tekemään ensin [quick start -dokumentin mukaisen workflown](https://docs.github.com/en/actions/get-started/quickstart) ja tarkistamaan, että saat sen toimimaan. Sen jälkeen voit muokata sitä sovelluksen käynnistämiseen ja testien suorittamiseen sopivaksi. Workflow-tiedoston nimellä ei ole merkitystä ja voit asettaa sen käynnistymään [esimerkiksi `push`- ja `workflow_dispatch`-tapahtumista](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push). Käytä [GitHubin Linux-pohjaista runneria](https://docs.github.com/en/actions/reference/runners/github-hosted-runners), esimerkiksi `ubuntu-latest`, joka sisältää valmiiksi useita vaadittuja työkaluja.

**Automaattinen arviointi**

Kun olet saanut workflow:n ajettua onnistuneesti, lisää siihen automaattiseen arviointiin vaadittavat kohdat.

Aloita määrittelemällä tiedoston alkuun käyttöoikeudet, jotka sallivat workflow:n lukea repositorion sisällön ja kirjoittaa commitin statukseen tehtävästä saamasi pisteet:

```diff
+ permissions:
+   contents: read
+   statuses: write
```

Lisää työnkululle timeout, joka estää työnkulkua jäämästä jumiin, jos se kestää liian kauan. Lisää myös loppuun step, joka käynnistää automaattisen arvioinnin:

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

Huomaa, että sovellus tulee käynnistää *taustalle*, jotta GitHub actions voi jatkaa seuraaviin vaiheisiin ja suorittaa testit. Docker compose käynnistää palvelut taustalle automaattisesti jos käytät `-d`- tai `--detach`-vaihtoehtoa. Node.js:llä voit käyttää Bashin `&`-merkkiä, joka käynnistää komennon taustalle. Etsi tarpeen mukaan lisätietoa ja kokeile ratkaisuasi komentorivillä ennen sen lisäämistä workflow:hun.

**Käynnistymisen odottaminen**

Pelkkä taustakäynnistys ei tarkoita, että sovellus olisi heti valmis vastaamaan HTTP-pyyntöihin. Palvelimelle kestääkin hetken, ennen kuin se on valmis ja testit voidaan aloittaa.

Lisää workflow:hun vaihe, joka odottaa, kunnes sovellus vastaa HTTP-pyyntöihin. Voit esimerkiksi [tarkistaa curl-komennolla toistuvasti `GET /health` -päätepistettä rajatun ajan](https://everything.curl.dev/usingcurl/downloads/retry.html), kunnes saat vastauksen. Määritä myös workflow:hun [aikaraja](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idstepstimeout-minutes), jotta workflow ei jää tarpeettomasti ajoon, jos sovellus ei vastaa esimerkiksi yhden minuutin kuluessa.

### 3. Valitse testaustyökalu

Varsinaisten testien suunnittelun ja suorittamisen osalta voit valita itse sopivan tavan ja työkalun. Testien tulee kuitenkin olla automatisoitavissa komentoriviltä, jotta voit automatisoida ne GitHub actionsissa. Testaustyökalun valinnassa kannattaa miettiä omia mieltymyksiä ja oppimistavoitteita sekä eri testaustyökalujen ominaisuuksia.

**JS/TS-pohjaiset testit**

Aikaisemmin käyttämistämme testaustyökaluista esimerkiksi Playwright ei välttämättä ole tällä kertaa suositeltava  valinta, sillä se on tarkoitettu pääasiassa selainpohjaisten käyttöliittymien testaamiseen, ja tällä kertaa testaamme REST-rajapintaa. Sen sijaan [Vitest](https://vitest.dev/) tukee Playwrightin kaltaisia testejä, joissa testit voidaan kirjoittaa JavaScriptillä tai TypeScriptillä, HTTP-pyynnöt tehdä [`fetch`-funktiolla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/fetch) ja vastaukset tarkistaa esimerkiksi [`expect`-funktiolla](https://vitest.dev/api/expect.html).

**REST/HTTP-pohjaiset testit**

Vitestin avulla on mahdollista testata liki mitä tahansa, mutta joissain tapauksissa saatat haluta mieluummin juuri REST-rajapintojen testaamiseen tarkoitettuja työkaluja.[Robot Frameworkin laajennoksista](https://robotframework.org/#resources) löytyykin juuri HTTP-pyyntöjen tekemiseen tarkoitettuja kirjastoja, joiden avulla voit kirjoittaa testisi Robot-syntaksia ja -komentoja käyttäen.

Lisäksi monet muut avoimen lähdekoodin työkalut, kuten [Bruno](https://www.usebruno.com/), tukevat HTTP-pyyntöjen tekemistä ja vastausten tarkistamista. Brunon vahvuuksiin kuuluvat mm. suoraviivainen komentorivikäyttö sekä paikallisesti että GitHub actionsissa.

**GitHub actions -työnkulut, laajennokset ja pilvipalvelut**

Eri työkaluihin tutustuessasi saatat törmätä erilaisiin kaupallisiin sekä avoimen lähdekoodin GitHub actions -työnkulkuihin, laajennoksiin ja pilvipalveluihin, jotka tarjoavat erilaisia ratkaisuja testien suorittamiseen. Suhtaudu tarjontaan kriittisesti ja pyri valitsemaan sellainen työkalu, joka ei edellytä ylimääräisiä asennuksia, kirjautumisia tai muita toimenpiteitä. Ideaalitapauksessa valitsemasi työkalu suorittaa testit samalla tavalla sekä paikallisesti että GitHub actionsissa.

### 4. Testien kirjoittaminen suorittaminen: perustapaukset (10 * 3 %)

Kirjoita testit, jotka tarkistavat sovelluksen rajapinnan toimintaa eri tilanteissa. Testien tulee tarkistaa HTTP-tilakoodit ja tarvittaessa myös vastauksen sisältö. Testit tulee pystyä suorittamaan GitHub actionsissa.

Lisää GitHub actions -workflow:hun vaihe, joka asentaa testiesi riippuvuudet ja suorittaa testit. Varmista, että olet myös lisännyt kaikki testaukseen tarvittavat tiedostot ja asetukset repositorioon, jotta testit voidaan suorittaa GitHub actionsissa.

Suosittelemme, että testaat esimerkiksi ensin palvelimen juuressa olevan päätepisteen `GET /` ja `GET /health`, jotka eivät vaadi autentikointia. Näistä saat jo osan pisteistä. Voit myös testata autentikointia vaativat päätepisteet ilman autentikointia, jolloin saat testattua, että palvelin palauttaa `401 Unauthorized` -tilakoodin.

Kun saat nämä testit toimimaan GitHub actionsissa, kannattaa siirtyä testaamaan autentikointia vaativia päätepisteitä kirjautumalla ensin sisään ja käyttämällä saamaasi tokenia. Autentikointia ja tokenia koskevat ohjeet löytyvät [sovelluksen README:stä](./app/README.md).

| Päätepiste | Testattavat tilanteet |
| --- | --- |
| `GET /` | Tervetuloviesti JSON-muodossa ja `200`. |
| `GET /health` | Ilman kirjautumista palautuu `200` ja vastaus kertoo kyseessä olevan esimerkinomainen tarkistus. |
| `POST /auth/login` | Oikeilla tunnuksilla palautuu token; väärillä tunnuksilla `401`. Virheellinen JSON sekä puuttuvat tai väärän tyyppiset kentät palauttavat `400`. |
| `GET /workouts` | Kirjautuneena palautuu lista; varmista, että luotu workout näkyy siinä ja poistettu ei enää näy. |
| `POST /workouts` | Kelvollisilla tiedoilla palautuu `201`, luotu workout ja sen ID. Virheelliset syötteet palauttavat `400`. |
| `GET /workouts/:id` | Luotu workout löytyy ID:llä ja sen tiedot ovat oikein. Tuntematon ID palauttaa `404`. Jos workout kuuluu toiseen käyttäjään, palauttaa `404`. |
| `PUT /workouts/:id` | Kelvollinen päivitys palauttaa `200`, säilyttää ID:n ja muuttaa tiedot myös myöhemmässä haussa. Virheelliset syötteet palauttavat `400`, tuntematon ID tai eri käyttäjän datan muokkausyritys palauttavat `404`. |
| `DELETE /workouts/:id` | Luodun workoutin poisto palauttaa `204` ja tyhjän vastauksen. Tuntematon ID tai eri käyttäjän datan poistoyritys palauttaa `404`. |

### 5. Testien kirjoittaminen suorittaminen: virhetilanteet (10 * 3 %)

Onnistuneiden pyyntöjen lisäksi testien tulee tarkistaa myös virhetilanteita. Testaa esimerkiksi eri pyyntöjen yhteydessä puuttuvia kenttiä, tyhjää nimeä, virheellistä kestoa ja virheellistä JSONia. Varmista, ettei epäonnistunut päivitys muuta tallennettuja tietoja.

Tarkista lisäksi, että autentikointia vaativat päätepisteet palauttavat `401 Unauthorized`, jos pyyntö lähetetään esimerkiksi ilman tokenia.

Käytä testeissäsi molempia käyttäjätunnuksia, jotta voit varmistaa, että käyttäjät eivät voi nähdä, muokata tai poistaa toistensa tietoja. Voit luoda molemmille käyttäjille kirjautumistokenit ja testata, että toisella tokenilla luotu treeni ei ole toisen käyttäjän luettavissa, muokattavissa tai poistettavissa.

## Tehtävän lähettäminen ja arviointi

Lähetä ratkaisusi GitHubiin ja varmista, että workflow suoritetaan onnistuneesti. Tarkista, että testien suorittaminen onnistuu ja tutki automaattisen arvioinnin tulokset.

On hyvin mahdollista, että testisi menevät läpi ja että et saa aivan kaikkia pisteitä. Tässä tilanteessa kannattaa tarkistaa autograding-raportista ne testitapaukset, joista pisteitä ei tullut, ja tutkia onko niissä tilanteita, joita et ole huomioinut testeissäsi.

Voit lähettää ratkaisusi GitHubiin useita kertoja tehtävän määräaikaan asti. Varmista kuitenkin, että viimeisin suoritus tuottaa parhaan tuloksen.

## Materiaalista

Tämän tehtävän on kehittänyt Teemu Havulinna ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/).

Tehtävän luonnissa on hyödynnetty kielimalleja ja tekoälytyökaluja, kuten GitHub Copilot.
