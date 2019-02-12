
var count = "1";
var container = document.getElementById("noteDisplay");
var card = document.createElement("div");
card.setAttribute("class","card")
container.appendChild(card);

//Add head
var innerDiv = document.createElement("div");
innerDiv.setAttribute("class","card-header");
innerDiv.setAttribute("id","heading"+count);
card.appendChild(innerDiv);

var h2Ele = document.createElement("h2");
h2Ele.setAttribute("class","mb-0");
innerDiv.appendChild(h2Ele)

var button = document.createElement("button");
button.setAttribute("class","btn btn-link");
button.setAttribute("type","button");
button.setAttribute("data-toggle","collapse");
button.setAttribute("data-target","collapse" + count);
button.setAttribute("aria-expanded","true");
button.setAttribute("aria-controls","collapse" + count);
button.innerHTML = "<h3>"+note.name+"</h3>";
h2Ele.appendChild(button);

<div class="accordion" id="accordionExample">
    <div class="card">
        <div class="card-header" id="headingOne">
            <h2 class="mb-0">
                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne"
                    aria-expanded="true" aria-controls="collapseOne">
                    Collapsible Group Item #1
                </button>
            </h2>
        </div>

        <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div class="card-body">
                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf
                moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.
                Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda
                shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea
                proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim
                aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </div>
        </div>
    </div>
</div>

//Add body
innerDiv = document.createElement("div");
innerDiv.setAttribute("id","collapse"+count);
innerDiv.setAttribute("class","collapse show");
innerDiv.setAttribute("aria-labelledby","heading"+count);
innerDiv.setAttribute("data-parent","#notes_diplay");
card.appendChild(innerDiv);

var innerDiv2 = document.createElement("div");
innerDiv2.setAttribute("class","card-body");
innerDiv2.innerHTML = "<h6>Name : "+note.name+"</h6>" + "<br />Language : " + note.language + "<br />Tags :" + note.tag + "<br />Note : " + note.note;
innerDiv.appendChild(innerDiv2);