import { apiInitializer } from "discourse/lib/api";
import { ajax } from 'discourse/lib/ajax';

export default apiInitializer("0.11.1", (api) => {
  if (!settings.header_links) {
    return;
  }

  var headerLinks = JSON.parse(settings.header_links);

  const links_position =
    settings.links_position === "right"
      ? "header-buttons:before"
      : "home-logo:after";

  var user_tags = api.getCurrentUser().custom_fields["tags"];
  user_tags = [user_tags].flat()
  var papers = JSON.parse(sessionStorage.getItem("user-papers"));
  //console.log(user_tags);
  var items2 = [];
  // var desc_map = {};
  // console.log(user_tags.length);
  // console.log(papers);
  // //console.log(Object.keys(papers).length);
  // if(papers === null || user_tags.length != Object.keys(papers).length) {
  //   // user_tags.sort(function(a, b) {
  //   //   return parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]) || parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]);
  //   // });
  //   // user_tags.reverse();
  //   // user_tags.forEach((tag) => {
  //   //   items2.push({"headerLinkId":  0, "title": tag, "icon": "scroll", "url": "/tag/" + tag, "description": ""})
  //   // });
  //   user_tags.forEach((tag) => {
  //     var description = ""
  //     ajax("/tag/" + tag + ".json").then(response =>  {
  //       return response
  //     }).then(data => {
  //         description = data["topic_list"]["tags"][0]["description"];
  //         items2.push({"headerLinkId":  0, "title": tag, "icon": "scroll", "url": "/tag/" + tag, "description": description})
  //         desc_map[tag] = description;
  //         if(items2.length == user_tags.length) {
  //           sessionStorage.setItem("user-papers", JSON.stringify(desc_map));
  //           console.log(items2)
  //           items2.sort(function(a, b) {
  //             a = a["title"];
  //             b = b["title"];
  //             return parseInt(a.split("-")[0]) - parseInt(b.split("-")[0]) || parseInt(a.split("-")[1]) - parseInt(b.split("-")[1]);
  //           });
  //           items2.reverse();
  //           sessionStorage.setItem("paper-links", JSON.stringify(items2));
  //           console.log("event");
  //           api.dispatchWidgetAppEvent("header-buttons", "custom-header-links", "force:refresh");
  //         }
  //     });
  //   });
  // }

  api.decorateWidget(links_position, (helper) => {
    const scrolling = helper.attrs.minimized;
    
    headerLinks[0]["user_tags"] = items2;
    return helper.widget.attach("custom-header-links", {
      headerLinks,
    });
  });
});
